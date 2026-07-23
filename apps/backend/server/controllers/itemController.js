import { Prisma } from "@prisma/client";
import prisma from "../db/prisma.js";

export async function getHealth(_req, res) {
  res.status(200).json({ message: "API is healthy" });
}

function normalizeSort(sort) {
  const lowered = (sort || "newest").toLowerCase();
  const allowed = new Set(["newest", "oldest", "name_asc", "name_desc"]);
  return allowed.has(lowered) ? lowered : "newest";
}

function mapItemRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    createdAt: row.created_at,
    category: {
      id: row.category_id,
      name: row.category_name,
    },
  };
}

function parseItemPayload(body) {
  const name = body.name?.trim();
  const description = body.description?.trim();
  const categoryId = Number(body.categoryId);

  if (
    !name ||
    !description ||
    !Number.isInteger(categoryId) ||
    categoryId <= 0
  ) {
    return {
      isValid: false,
      message: "name, description, and a valid categoryId are required",
    };
  }

  return {
    isValid: true,
    data: {
      name,
      description,
      categoryId,
    },
  };
}

export async function getItems(req, res, next) {
  const search = req.query.search?.trim() || "";
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
  const sort = normalizeSort(req.query.sort);

  if (
    req.query.categoryId &&
    (!Number.isInteger(categoryId) || categoryId <= 0)
  ) {
    return res.status(400).json({
      message: "categoryId must be a positive integer",
    });
  }

  const sortClause = {
    newest: Prisma.sql`ORDER BY items.created_at DESC`,
    oldest: Prisma.sql`ORDER BY items.created_at ASC`,
    name_asc: Prisma.sql`ORDER BY items.name ASC`,
    name_desc: Prisma.sql`ORDER BY items.name DESC`,
  };

  try {
    const whereFragments = [Prisma.sql`WHERE 1 = 1`];

    if (search) {
      whereFragments.push(
        Prisma.sql`AND (items.name ILIKE ${`%${search}%`} OR items.description ILIKE ${`%${search}%`})`,
      );
    }

    if (categoryId) {
      whereFragments.push(Prisma.sql`AND items.category_id = ${categoryId}`);
    }

    const rows = await prisma.$queryRaw`
      SELECT
        items.id,
        items.name,
        items.description,
        items.category_id,
        items.created_at,
        categories.name AS category_name
      FROM items
      JOIN categories ON items.category_id = categories.id
      ${Prisma.join(whereFragments, " ")}
      ${sortClause[sort]}
    `;

    res.status(200).json({
      message: "Items retrieved successfully",
      data: rows.map(mapItemRow),
    });
  } catch (error) {
    next(error);
  }
}

export async function getItemById(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "id must be a positive integer" });
  }

  try {
    const rows = await prisma.$queryRaw`
      SELECT
        items.id,
        items.name,
        items.description,
        items.category_id,
        items.created_at,
        categories.name AS category_name
      FROM items
      JOIN categories ON items.category_id = categories.id
      WHERE items.id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({
      message: "Item retrieved successfully",
      data: mapItemRow(rows[0]),
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(_req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function createItem(req, res, next) {
  const parsed = parseItemPayload(req.body);

  if (!parsed.isValid) {
    return res.status(400).json({ message: parsed.message });
  }

  try {
    const item = await prisma.item.create({
      data: parsed.data,
      include: {
        category: true,
      },
    });

    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ message: "categoryId does not exist" });
    }

    next(error);
  }
}

export async function updateItem(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "id must be a positive integer" });
  }

  const parsed = parseItemPayload(req.body);
  if (!parsed.isValid) {
    return res.status(400).json({ message: parsed.message });
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id },
      data: parsed.data,
      include: { category: true },
    });

    return res.status(200).json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }

    if (error.code === "P2003") {
      return res.status(400).json({ message: "categoryId does not exist" });
    }

    next(error);
  }
}

export async function deleteItem(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "id must be a positive integer" });
  }

  try {
    const deletedItem = await prisma.item.delete({ where: { id } });

    return res.status(200).json({
      message: "Item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }

    next(error);
  }
}

export async function getItemStats(_req, res, next) {
  try {
    const rows = await prisma.$queryRaw`
      SELECT
        categories.id,
        categories.name,
        COUNT(items.id)::INTEGER AS item_count
      FROM categories
      LEFT JOIN items ON items.category_id = categories.id
      GROUP BY categories.id, categories.name
      ORDER BY categories.name ASC
    `;

    res.status(200).json({
      message: "Item stats retrieved successfully",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
}
