import express from "express";
import productRouter from "./routes/productRoutes.js";
import permissionRouter from "./routes/permissionRoutes.js";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("Welcome to the admin routes.");
});

adminRouter.use("/products", productRouter);
adminRouter.use("/permissions", permissionRouter);

export default adminRouter;