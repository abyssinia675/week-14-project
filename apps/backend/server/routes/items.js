import { Router } from "express";
import {
  createItem,
  getCategories,
  getHealth,
  getItems
} from "../controllers/itemController.js";

const router = Router();

router.get("/health", getHealth);
router.get("/categories", getCategories);
router.get("/items", getItems);
router.post("/items", createItem);

export default router;
