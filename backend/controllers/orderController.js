import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import ApiFeatures from "../utils/ApiFeaturs.js";
import AppError from "../utils/AppError.js";

/**
 *
 * @description Create new order
 * @routr POST /api/orders
 * @access Private
 */
const addOrderItems = () =>
  asyncHandler(async (req, res, next) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
      if (orderItems && orderItems.length === 0) {
        const er = new AppError("No order items", 400);
        res.status(er.statusCode).json({ message: er.message });
        return;
      }

      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      const createdOrder = await order.save();
      //const createdOrder = await order.save();
      res.status(201).json({
        createdOrder,
      });
    } catch (error) {
      res.status(403).json({
        message: "order failed",
        stack: error,
      });
    }
  });

/**
 * @description show order before payment
 * @route GET api/orders/:id
 * @access Private
 */
const getOrderById = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({
        message: "No order ware found!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

/**
 * @description show order before payment
 * @route GET api/orders/:id
 * @access Private
 */
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
      const updatedOrder = await order.save();

      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({
        message: "No order ware found!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

/**
 * @description Update order to delivered
 * @route GET api/orders/:id/deliver
 * @access Private/admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDeliverd = true;
      order.deliverdAt = Date.now();

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({
        message: "No order ware found!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

/**
 * @description get logged in user orders
 * @route GET api/orders/myorders
 * @access Private
 */
const getMyOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.status(201).json(orders);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

/**
 * @description get all orders
 * @route GET api/orders
 * @access Private
 */
const getAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.status(201).json(orders);
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered,
};
