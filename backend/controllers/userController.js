import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const filterObj = (obj, ...alloawedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (alloawedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const myProfile = () =>
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (user) {
        res.status(201).json({
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        });
        console.log("end");
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(404).json({
        message: error + "no",
      });
    }
    // console.log(req.locals);
  });

/**
 *
 * @description Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateUserProfile = () =>
  asyncHandler(async (req, res, next) => {
    try {
      if (req.body.password || req.body.passwordConfirm) {
        return next(
          new AppError("This route is not for password update.", 400)
        );
      }

      //2) filterd out unwanted fields names that are not allowed to update
      const filterBody = filterObj(req.body, "name", "email");

      //3) update user document
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filterBody,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        user: updatedUser,
      });
    } catch (error) {
      res.status(404).json({
        message: "Sorry, user not found!",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

/**
 *
 * @description Get all users
 * @route GET /api/users
 * @access Private/Admin
 */
const getUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find({}); //.populate("user", "name");
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({
      message: "No users ware founed",
      stack: error,
    });
  }
  // console.log(req1.locals);
});

/**
 *
 * @description Get user by ID
 * @route GET /api/users/:id
 * @access Private/Admin
 */
const getUserById = () =>
  asyncHandler(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); //.populate("user", "name");

      if (user) {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(404).json({
        message: "No user founed",
        stack: error,
      });
    }
    next();
    // console.log(req.locals);
  });
export { filterObj, myProfile, updateUserProfile, getUsers, getUserById };
