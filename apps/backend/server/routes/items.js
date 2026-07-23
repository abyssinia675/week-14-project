import { Router } from "express";
import {
  createItem,
  deleteItem,
  getCategories,
  getHealth,
  getItemById,
  getItems,
  getItemStats,
  updateItem,
} from "../controllers/itemController.js";

const router = Router();

router.get("/health", getHealth);
router.get("/categories", getCategories);
router.get("/items/stats", getItemStats);
router.get("/items", getItems);
router.get("/items/:id", getItemById);
router.post("/items", createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

export default router;
