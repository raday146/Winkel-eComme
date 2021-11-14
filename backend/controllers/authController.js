import promisify from "util-promisify";
import crypto from "crypto";
import { filterObj } from "./userController.js";
import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import asyncHandler from "express-async-handler";
import AppError from "../utils/AppError.js";

const signToken = (id) => {
  console.log("id:", id);

  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV !== "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);

  // this for removing password from the output
  user.password = undefined;

  res.status(statusCode).json({
    token,
    user,
  });
};

/**
 * @description Signup new user and creating a token
 * @route Post/api/users/singup
 * @access Public
 */
const signup = () =>
  asyncHandler(async (req, res, next) => {
    console.log("s");
    try {
      const newUser = await User.create(req.body);
      createSendToken(newUser, 201, res);
    } catch (error) {
      res.status(400).json({
        message: "Fill all the fields to compleet the registration",
        stack: error.message,
      });
    }
    console.log("s");
  });

/**
 *
 * @description Auth user and get token
 * @route Post/api/users/login
 * @access Public
 */

const login = () =>
  asyncHandler(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log(email, password, "auth");

      // 1) checj if email and password exist
      if (!email || !password) {
        const er = new AppError("Please provide email and password!", 400);
        res.status(er.statusCode).json({ message: er.message });
      }

      // 2) check if user exists and password is correct

      const user = await User.findOne({ email }).select("+password");
      // 3) if everything ok, send token to client
      if (!user || !(await user.correctPassword(password, user.password))) {
        const er = new AppError("Incorrect email or password", 401);
        res.status(er.statusCode).json({ message: er.message });
      }
      console.log(user);
      createSendToken(user, 200, res);
    } catch (error) {
      res.status(401).json({
        message: "Incorrect email or password",
        stack: error.message,
      });
    }
  });

/**
 *
 * @description Protect by verfied user
 *
 */

const protect = asyncHandler(async (req, res, next) => {
  let token = req.params.token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie) {
    token = req.headers.cookie.split("=")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in, please log in to get access.", 401)
    );
  }

  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(404).json({ error: "Invalid token" });
    // return next(new AppError("You may have Autorizaiton problem!", 401));
  }
  //4)check if user changed password after the token was issued
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The token belonging to this user no longer exist!", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! please log in again.", 401)
    );
  }

  req.user = currentUser;
  console.log("end protect");

  next();
});

/**
 *
 * @description Logout user by expiring the token
 * @route Post/api/users/logout
 * @access private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  res.status(200).json({
    status: "logout successefuly!",
  });
});

const updatePassword = () =>
  asyncHandler(async (req, res, next) => {
    try {
      const currentUser = await User.findById(req.user.id).select("+password");

      // 2) check  if Posted current password is correct.

      if (
        !(await currentUser.correctPassword(
          req.body.currentPassword,
          currentUser.password
        ))
      ) {
        const er = new AppError("Your current password is wrong.", 401);
        res.status(er.statusCode).json({ message: er.message });
        return;
      }

      //3) if so, update  password

      currentUser.password = req.body.password;
      await currentUser.save();
      // currentUser.findByUpdate will not work as intended!

      //4) log user in, send jwt
      createSendToken(currentUser, 200, res);
    } catch (error) {
      res.status(403).json({
        message: "Sorry, it may a problem to operate the order!",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

const restriction = (req, res, next) => {
  console.log("here");
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    const err = new AppError(
      "You do not have premission to perform this action",
      401
    );
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
  }
};

/**
 *
 * @description Delete User
 * @route DELETE /api/users/:id
 * @access Private/Admin
 */
const deleteUser = () =>
  asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.params.id); //.populate("user", "name");
      if (user) {
        await user.remove();

        res.status(200).json({
          message: "User removed",
        });
      } else {
        res.status(401).json({
          message: "No users ware founed",
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

/**
 *
 * @description Update user
 * @route PUT /api/users/:id
 * @access Private/Admin
 */
const updateUser = () =>
  asyncHandler(async (req, res) => {
    try {
      console.log("req.params.id: ", req.params.id);
      // const user = await User.findById(req.params.id); //.populate("user", "name");
      const filterBody = filterObj(req.body, "name", "email", "isAdmin");

      //3) update user document
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        filterBody,
        {
          new: true,
          runValidators: true,
        }
      );
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: signToken(updatedUser._id),
      });

      /*
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;
        console.log("end if ");
      }
      console.log(req.body.name, req.body.email, req.body.isAdmin);
      const updatedUser = await user.save().catch((err) => console.log(err));
      console.log("saved update");
 
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: signToken(updatedUser._id),
      });*/
    } catch (error) {
      res.status(404).json({
        message: "User not founed",
        stack: error,
      });
    }
    // console.log(req.locals);
  });

export {
  login,
  signup,
  protect,
  logout,
  updatePassword,
  restriction,
  deleteUser,
  updateUser,
};
