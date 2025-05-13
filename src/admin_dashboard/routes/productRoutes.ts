import express from "express";
import {
  addNewProduct,
  addNewProductCategory,
} from "../controllers/productControllers.js";
import { adminAuthMiddleware } from "../middleware/AdminAuth.js";

const productRouter = express.Router();

productRouter.post("/add/new", addNewProduct);
productRouter.post(
  "/add/new/category",
  adminAuthMiddleware,
  addNewProductCategory
);

export default productRouter;
