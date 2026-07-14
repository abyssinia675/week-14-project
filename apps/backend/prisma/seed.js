import "dotenv/config";
import prisma from "../server/db/prisma.js";

async function main() {
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      { name: "Frontend" },
      { name: "Backend" },
      { name: "Database" }
    ]
  });

  if (categories.count === 0) {
    return;
  }

  const savedCategories = await prisma.category.findMany({
    orderBy: { id: "asc" }
  });

  await prisma.item.createMany({
    data: [
      {
        name: "Build a React page",
        description: "Create a component that fetches data from the Express API.",
        categoryId: savedCategories[0].id
      },
      {
        name: "Create an Express route",
        description: "Add a REST endpoint that returns JSON from PostgreSQL.",
        categoryId: savedCategories[1].id
      },
      {
        name: "Design a table",
        description: "Practice creating related tables with primary and foreign keys.",
        categoryId: savedCategories[2].id
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
