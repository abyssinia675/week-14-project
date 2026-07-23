import "dotenv/config";
import prisma from "../server/db/prisma.js";

async function main() {
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      { name: "Applied" },
      { name: "Interview Scheduled" },
      { name: "Final Round" },
      { name: "Offer" },
    ],
  });

  if (categories.count === 0) {
    return;
  }

  const savedCategories = await prisma.category.findMany({
    orderBy: { id: "asc" },
  });

  await prisma.item.createMany({
    data: [
      {
        name: "Software Engineer Intern - Shopify",
        description:
          "Application submitted through the careers portal. Waiting for recruiter response.",
        categoryId: savedCategories[0].id,
      },
      {
        name: "Frontend Developer - Figma",
        description:
          "Recruiter screen completed. Technical interview scheduled for next Tuesday.",
        categoryId: savedCategories[1].id,
      },
      {
        name: "Product Analyst - Notion",
        description:
          "Completed take-home assignment and preparing for final panel interview.",
        categoryId: savedCategories[2].id,
      },
      {
        name: "UX Research Assistant - Duolingo",
        description:
          "Received a verbal offer and waiting for the written details.",
        categoryId: savedCategories[3].id,
      },
    ],
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
