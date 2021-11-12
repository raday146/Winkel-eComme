import express from "express";
import {
  getAll,
  getOne,
  deleteProduct,
  createProduct,
  updateProduct,
  createReviewProduct,
  getTopProduct,
  aliasTopProducts,
} from "../controllers/productController.js";
import { protect, restriction } from "../controllers/authController.js";
const router = express.Router();

/**
 * @description fetch all products
 * @route Get/api/products
 * @access Public
 */

//router.get("/:id", getAll());
router.get("/top", aliasTopProducts, getTopProduct());

router.route("/").get(getAll()).post(protect, restriction, createProduct());
/**
 * @description fetch single product by id
 * @route Get/api/products/:id
 * @access Public
 */
router.route("/:id").get(getOne());
router.use(protect);

router.route("/:id/reviews").post(createReviewProduct());
router.use(restriction);
router.route("/:id").delete(deleteProduct()).put(updateProduct());
export default router;
