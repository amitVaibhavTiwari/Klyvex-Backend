import express from "express";
import "express-async-errors";
import productRouter from "./routes/productRoutes.js";
import permissionRouter from "./routes/permissionRoutes.js";
import warehouseRouter from "./routes/warehouseRoutes.js";
import { adminAuthMiddleware } from "./middleware/AdminAuth.js";
import { adminCSRFMiddleware } from "./middleware/CSRFMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import staffRouter from "./routes/staffRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import shopMetaRouter from "./routes/shopMetaRoutes.js";

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("Welcome to the admin routes.");
});

adminRouter.use("/auth", authRouter);
adminRouter.use(
  "/staff",
  [adminAuthMiddleware, adminCSRFMiddleware],
  staffRouter
);
adminRouter.use(
  "/products",
  [adminAuthMiddleware, adminCSRFMiddleware],
  productRouter
);
adminRouter.use(
  "/permissions",
  [adminAuthMiddleware, adminCSRFMiddleware],
  permissionRouter
);
adminRouter.use(
  "/warehouse",
  [adminAuthMiddleware, adminCSRFMiddleware],
  warehouseRouter
);

adminRouter.use(
  "/shopmeta",
  [adminAuthMiddleware, adminCSRFMiddleware],
  shopMetaRouter
);

adminRouter.use(errorHandler);

export default adminRouter;
