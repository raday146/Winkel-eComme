import express from "express";
import { protect, restriction } from "../controllers/authController.js";
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
const router = express.Router();

router.use(protect);
router.post("/", addOrderItems()).get("/myorders", getMyOrders);
router.get("/:id", getOrderById).put("/:id/pay", updateOrderToPaid);

router.use(restriction);

router.get("/", getAllOrders).put("/:id/deliver", updateOrderToDelivered);
export default router;
