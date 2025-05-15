import express from "express";
import {
  addNewProduct,
  addNewProductCategory,
  addNewVariantToProduct,
  addProductToCategory,
} from "../controllers/productControllers.js";
import { adminAuthMiddleware } from "../middleware/AdminAuth.js";

const productRouter = express.Router();

productRouter.post("/add/new", adminAuthMiddleware, addNewProduct);
productRouter.post(
  "/add/new/category",
  adminAuthMiddleware,
  addNewProductCategory
);

productRouter.post(
  "/add/new/variant",
  adminAuthMiddleware,
  addNewVariantToProduct
);

productRouter.post(
  "/add-product-category-relation",
  adminAuthMiddleware,
  addProductToCategory
);

export default productRouter;
