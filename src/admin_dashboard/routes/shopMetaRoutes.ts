import express from "express";
import { addShopMeta } from "../controllers/ShopMetaControllers/ShopMetaControllers.js";

const shopMetaRouter = express.Router();

shopMetaRouter.post("/add/new", addShopMeta);

export default shopMetaRouter;
