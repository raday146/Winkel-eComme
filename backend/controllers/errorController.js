import AppError from "../utils/AppError.js";

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please use another value. `;

  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in again!", 401);
const handleTokenExpiredrror = (err) =>
  new AppError("Your token has expired, please log in again!", 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // RENDERD WEBSITE
  return res.status(err.status).render("error", {
    title: "Somthing went wrong!",
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send massage to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.log("ERROR 500!!", err.stack);

  // 2) Send generate massage

  return res.status(err.statusCode).json({
    status: "Somthing went very wrong",
    message: "Please try again later.",
  });
};
const errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "devlopment") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handleTokenExpiredrror(error);

    sendErrorProd(error, req, res);
  }
};

export { errorController };
