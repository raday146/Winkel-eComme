import asyncHandler from "express-async-handler";
import Product from "../models/prodcutModel.js";
import { filterObj } from "./userController.js";
import ApiFeatures from "../utils/ApiFeaturs.js";
import AppError from "../utils/AppError.js";

const aliasTopProducts = (req, res, next) => {
  req.query.limit = "3";
  req.query.sort = "-rating";
  req.query.fields = "name,image,price";
  next();
};

const getAll = () =>
  asyncHandler(async (req, res) => {
    // to allow for nested GET reviews on tour(hack)
    let filter = {};
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    if (req.params.id) {
      filter = { product: req.params.id };
    }
    const features = new ApiFeatures(Product.find(filter), req.query)
      .search()
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const count = await Product.countDocuments({ ...features.regexString() });
    const products = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      page,
      pages: Math.ceil(count / pageSize),
      products,
    });
  });

const getOne = () =>
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(401).json({
          message: "Product not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: "No document found with that ID",
        stack: error.message,
      });
    }
  });

const deleteProduct = () =>
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.findById(req.params.id); //.populate("user", "name");
      if (product) {
        await product.remove();

        res.status(201).json({
          message: "product removed",
        });
      } else {
        res.status(401).json({
          message: "product not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: "Document not found",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

const createProduct = () =>
  asyncHandler(async (req, res) => {
    try {
      const product = await Product.create({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        category: "Sample category",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description",
      }); //.populate("user", "name");

      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({
        message: "Faild to create new product",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

const updateProduct = () =>
  asyncHandler(async (req, res) => {
    try {
      const filterBody = filterObj(
        req.body,
        "name",
        "price",
        "image",
        "brand",
        "category",
        "countInStock",
        "description"
      );

      //3) update user document
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        filterBody,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(201).json(updatedProduct);
    } catch (error) {
      res.status(404).json({
        message: "Document not found",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

/**
 * @description Create new review
 * @route POST /api/product/:id
 * @access Private/Admin
 */
//3) update user document
const createReviewProduct = () =>
  asyncHandler(async (req, res) => {
    try {
      const { rating, comment } = req.body;
      //3) update user document
      const product = await Product.findById(req.params.id);
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      console.log("dds");
      if (alreadyReviewed) {
        res.status(400).json({
          message: "Product already reviewed",
        });
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();

      res.status(201).json({
        message: "Review added",
      });
    } catch (error) {
      console.log("bug");
      res.status(404).json({
        message: "Document not found",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

const getTopProduct = () =>
  asyncHandler(async (req, res) => {
    try {
      let filter = req.params.id ? { product: req.params.id } : {};
      const features = new ApiFeatures(Product.find(filter), req.query)
        .search()
        .filter()
        .sort()
        .limitFields()
        .pagination();

      const products = await features.query;
      if (products) {
        res.status(200).json(products);
      } else {
        res.status(401).json({
          message: "Products not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: "Documnets not found",
        stack: error,
      });
    }
    // console.log(req.locals);
  });
export {
  getAll,
  getOne,
  deleteProduct,
  createProduct,
  updateProduct,
  createReviewProduct,
  getTopProduct,
  aliasTopProducts,
};
