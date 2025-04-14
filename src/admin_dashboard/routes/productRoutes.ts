import express from "express";
import { addNewProduct } from "../controllers/productControllers.js";

const productRouter = express.Router();

productRouter.post("/add/new", addNewProduct);

export default productRouter;
