import express from "express";
import { adminAuthMiddleware } from "../middleware/AdminAuth.js";
import {
  addProductToWarehouse,
  addWarehouse,
  editWarehouseStock,
} from "../controllers/warehouseControllers.js";

const warehouseRouter = express.Router();

warehouseRouter.post("/add/new", adminAuthMiddleware, addWarehouse);
warehouseRouter.post(
  "/add/new/product",
  adminAuthMiddleware,
  addProductToWarehouse
);

warehouseRouter.post(
  "/edit-warehouse-stock",
  adminAuthMiddleware,
  editWarehouseStock
);

export default warehouseRouter;
