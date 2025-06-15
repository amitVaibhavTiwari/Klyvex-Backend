import express from "express";
import {
  addNewProduct,
  addNewProductCategory,
  addNewVariantToProduct,
  addProductToCategory,
  createProductType,
  deleteProductFromCategory,
  editProductVariant,
} from "../controllers/ProductControllers/ProductControllers.js";

const productRouter = express.Router();

productRouter.post("/add/new", addNewProduct);
productRouter.post("/add/new/category", addNewProductCategory);
productRouter.post("/add/new/product-type", createProductType);

productRouter.post("/add/new/variant", addNewVariantToProduct);

productRouter.post("/add-product-to-category", addProductToCategory);
productRouter.post("/delete-product-from-category", deleteProductFromCategory);

productRouter.put("/edit-product-variant", editProductVariant);

export default productRouter;
