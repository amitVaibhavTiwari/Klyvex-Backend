import { Request, Response } from "express";
import { shopMetaRepository } from "../../../repositories/repositories.js";
export const addShopMeta = async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const shopMeta = shopMetaRepository.create({
    key,
    value,
  });
  await shopMetaRepository.save(shopMeta);
  res.status(201).json({
    status: "success",
    message: "Shop meta added successfully.",
  });
};
