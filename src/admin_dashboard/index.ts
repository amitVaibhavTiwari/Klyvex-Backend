import express from "express";
import productRouter from "./routes/productRoutes.js";
import permissionRouter from "./routes/permissionRoutes.js";
import adminUserRouter from "./routes/adminUserRoutes.js";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("Welcome to the admin routes.");
});

adminRouter.use("/staff", adminUserRouter);
adminRouter.use("/products", productRouter);
adminRouter.use("/permissions", permissionRouter);

export default adminRouter;
