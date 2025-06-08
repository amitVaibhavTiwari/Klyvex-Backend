import { Request, Response } from "express";
import {
  adminUserRepository,
  productVariantRepository,
  warehouseRepository,
  warehouseStockRepository,
} from "../../repositories/repositories.js";
import { checkActionPermission } from "../utils/checkPermission.js";
import { WarehouseStock } from "../../entities/WarehouseStock.js";

export const addWarehouse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, address, code, isActive, metaData, user } = req.body;
    if (!name || !address || !code) {
      res.status(400).json({
        status: "failed",
        message: "name, address, code are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_warehouse",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const existingWarehouse = await warehouseRepository.findOneBy({
      name,
      code,
    });

    if (existingWarehouse) {
      res.status(409).json({
        status: "failed",
        message: "Warehouse already exists.",
      });
      return;
    }

    const newWarehouse = warehouseRepository.create({
      name,
      address,
      code,
      isActive,
      metaData: metaData || null,
    });

    await warehouseRepository.save(newWarehouse);

    res.status(201).json({
      status: "success",
      message: "Warehouse created successfully.",
    });
  } catch (error: any) {
    console.error("Error creating warehouse:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal server error.",
    });
  }
};

export const addProductToWarehouse = async (req: Request, res: Response) => {
  try {
    const { warehouseId, variantId, user, metadata } = req.body;

    if (!warehouseId || !variantId) {
      res.status(400).json({
        status: "failed",
        message: "warehouseId, variantId are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_warehouse",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const targetWarehouse = await warehouseRepository.findOneBy({
      id: warehouseId,
    });

    if (!targetWarehouse) {
      res.status(404).json({
        status: "failed",
        message: "Warehouse not found.",
      });
      return;
    }
    const targetProduct = await productVariantRepository.findOneBy({
      id: variantId,
    });
    if (!targetProduct) {
      res.status(404).json({
        status: "failed",
        message: "Product not found.",
      });
      return;
    }

    const existingProduct = await warehouseStockRepository.findOne({
      where: {
        Warehouse: { id: warehouseId },
        ProductVariant: { id: variantId },
      },
    });

    if (existingProduct) {
      res.status(409).json({
        status: "failed",
        message: "Product already exists in the warehouse.",
      });
      return;
    }

    const newStock = new WarehouseStock();
    newStock.Warehouse = targetWarehouse;
    newStock.ProductVariant = targetProduct;
    newStock.metaData = metadata || null;
    await warehouseStockRepository.save(newStock);

    res.status(200).json({
      status: "success",
      message: "Product added to warehouse successfully.",
    });
  } catch (error: any) {
    console.error("Error adding product to warehouse:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal server error.",
    });
  }
};

export const editWarehouseStock = async (req: Request, res: Response) => {
  try {
    const { stockId, data, user } = req.body;

    if (!stockId || !data) {
      res.status(400).json({
        status: "failed",
        message: "stockId, and data are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_warehouse",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const targetStock = await warehouseStockRepository.findOneBy({
      id: stockId,
    });

    if (!targetStock) {
      res.status(404).json({
        status: "failed",
        message: "Warehouse stock not found.",
      });
      return;
    }

    // Update the stock with the new data
    Object.keys(data).forEach((key) => {
      if (key in targetStock) {
        (targetStock as any)[key] = data[key];
      }
    });

    await warehouseStockRepository.save(targetStock);

    res.status(200).json({
      status: "success",
      message: "Warehouse stock updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating warehouse stock:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal server error.",
    });
  }
};
