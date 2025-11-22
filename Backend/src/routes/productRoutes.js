import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getRelatedProductsBySignals,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);
router.get("/:id/related/signals", getRelatedProductsBySignals);

export default router;
