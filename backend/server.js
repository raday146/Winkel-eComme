import path from "path";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import mongoSanitize from "express-mongo-sanitize";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";

dotenv.config({ path: "./config.env" });
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { errorController } from "./controllers/errorController.js";
connectDB();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// data sanitization against NoSql query injection
app.use(mongoSanitize());
app.use(express.json({ limit: "10kb" }));

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/front/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "front", "build", "index.html"))
  );
} else {
  app.use((req, res, next) => {
    console.log("HELLO", req.originalUrl);
    next();
  });
}
//app.use(notFound);
//app.use(errorHandler);
app.use(errorController);

const port = process.env.PORT || 5000;
app.listen(
  port,
  console.log(
    `server running in ${process.env.NODE_ENV} made on port ${port}`.yellow.bold
  )
);
