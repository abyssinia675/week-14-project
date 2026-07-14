import prisma from "../db/prisma.js";

export async function getHealth(_req, res) {
  res.json({ status: "ok" });
}

export async function getItems(_req, res, next) {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true
      },
      orderBy: {
        id: "asc"
      }
    });

    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getCategories(_req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc"
      }
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createItem(req, res, next) {
  const { name, description, categoryId } = req.body;

  if (!name || !description || !categoryId) {
    return res.status(400).json({
      message: "name, description, and categoryId are required"
    });
  }

  try {
    const item = await prisma.item.create({
      data: {
        name,
        description,
        categoryId: Number(categoryId)
      },
      include: {
        category: true
      }
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}
