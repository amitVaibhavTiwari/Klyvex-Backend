import express from "express";
import {
  addNewProduct,
  addNewProductCategory,
  addNewVariantToProduct,
  addProductToCategory,
} from "../controllers/ProductControllers/ProductControllers.js";

const productRouter = express.Router();

productRouter.post("/add/new", addNewProduct);
productRouter.post("/add/new/category", addNewProductCategory);

productRouter.post("/add/new/variant", addNewVariantToProduct);

productRouter.post("/add-product-category-relation", addProductToCategory);

export default productRouter;
