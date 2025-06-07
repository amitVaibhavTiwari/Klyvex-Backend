import express from "express";
import productRouter from "./routes/productRoutes.js";
import permissionRouter from "./routes/permissionRoutes.js";
import adminUserRouter from "./routes/adminUserRoutes.js";
import warehouseRouter from "./routes/warehouseRoutes.js";
import { adminAuthMiddleware } from "./middleware/AdminAuth.js";
import { CsrfMiddleware } from "../middlewares/CsrfMiddleware.js";
import { adminCSRFMiddleware } from "./middleware/CSRFMiddleware.js";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("Welcome to the admin routes.");
});

adminRouter.use("/staff", adminUserRouter);
adminRouter.use("/products", productRouter);
adminRouter.use(
  "/permissions",
  [adminAuthMiddleware, adminCSRFMiddleware],
  permissionRouter
);
adminRouter.use("/warehouse", warehouseRouter);

export default adminRouter;
