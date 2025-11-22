import express from "express";
import {
  searchProducts,
  searchSuggestions,
} from "../controllers/searchController.js";

const router = express.Router();

// Full search result
router.get("/", searchProducts);

// Suggestions
router.get("/suggestions", searchSuggestions);

export default router;
