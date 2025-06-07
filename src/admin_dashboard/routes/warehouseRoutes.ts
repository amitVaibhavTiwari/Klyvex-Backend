import express from "express";
import {
  addProductToWarehouse,
  addWarehouse,
  editWarehouseStock,
} from "../controllers/warehouseControllers.js";

const warehouseRouter = express.Router();

warehouseRouter.post("/add/new", addWarehouse);
warehouseRouter.post("/add/new/product", addProductToWarehouse);
warehouseRouter.post("/edit-warehouse-stock", editWarehouseStock);

export default warehouseRouter;
