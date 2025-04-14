import express from "express";
import productRouter from "./routes/productRoutes.js";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("Welcome to the admin routes.");
});

adminRouter.use("/products", productRouter);

export default adminRouter;
