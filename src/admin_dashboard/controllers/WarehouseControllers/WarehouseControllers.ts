import { Request, Response } from "express";
import {
  adminUserRepository,
  productVariantRepository,
  warehouseRepository,
  warehouseStockRepository,
} from "../../../repositories/repositories.js";
import { checkActionPermission } from "../../utils/checkPermission.js";
import { WarehouseStock } from "../../../entities/WarehouseStock.js";
import { PermissionEnum } from "../../utils/Permissions.js";
import { validateDTO } from "../../utils/validateDto.js";
import { validateAdminUser } from "../../utils/validateAdminUser.js";
import {
  addProductToWarehouseDTO,
  addWarehouseDTO,
  deleteWarehouseStockDTO,
  editWarehouseStockDTO,
} from "./DTOs.js";

export const addWarehouse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, address, code, isActive, metadata, user } = await validateDTO(
    addWarehouseDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_warehouse);

  const existingWarehouse = await warehouseRepository.find({
    where: [{ name: name }, { code: code }],
  });

  if (existingWarehouse) {
    res.status(409).json({
      status: "failed",
      message: "Warehouse with same name or code already exists.",
    });
    return;
  }

  const newWarehouse = warehouseRepository.create({
    name,
    address,
    code,
    isActive,
    metaData: metadata,
  });

  await warehouseRepository.save(newWarehouse);

  res.status(201).json({
    status: "success",
    message: "Warehouse created successfully.",
  });
};

export const addProductToWarehouse = async (req: Request, res: Response) => {
  const { warehouseId, variantId, user, metadata, stockQuantity } =
    await validateDTO(addProductToWarehouseDTO, req.body);

  await validateAdminUser(user.userId, PermissionEnum.manage_warehouse);

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
      warehouseId: warehouseId,
      productVariantId: variantId,
    },
  });

  if (existingProduct) {
    res.status(409).json({
      status: "failed",
      message: "Product already exists in the warehouse.",
    });
    return;
  }

  const newStock = warehouseStockRepository.create({
    productVariantId: variantId,
    warehouseId: warehouseId,
    metaData: metadata,
    stockQuantity: stockQuantity,
  });
  await warehouseStockRepository.save(newStock);

  res.status(200).json({
    status: "success",
    message: "Product added to warehouse successfully.",
  });
};

export const editWarehouseStock = async (req: Request, res: Response) => {
  const { stockId, data, user } = await validateDTO(
    editWarehouseStockDTO,
    req.body
  );

  const adminUser = await adminUserRepository.findOne({
    where: { id: user.userId },
  });

  if (!adminUser) {
    res.status(404).json({
      status: "failed",
      message: "User not found.",
    });
    return;
  }

  const hasInventoryPermission = checkActionPermission(
    PermissionEnum.manage_inventory,
    adminUser?.adminGroupsId
  );

  const hasWarehousePermission = checkActionPermission(
    PermissionEnum.manage_warehouse,
    adminUser?.adminGroupsId
  );

  if (!hasInventoryPermission && !hasWarehousePermission) {
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
};

export const deleteWarehouseStock = async (req: Request, res: Response) => {
  const { stockId, user } = await validateDTO(
    deleteWarehouseStockDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_warehouse);

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

  await warehouseStockRepository.remove(targetStock);

  res.status(200).json({
    status: "success",
    message: "Warehouse stock deleted successfully.",
  });
};

// wil use in future
// export const getWarehouseStocks = async (req: Request, res: Response) => {
//   try {
//     const { warehouseId, user } = req.body;

//     if (!warehouseId) {
//       res.status(400).json({
//         status: "failed",
//         message: "warehouseId is required.",
//       });
//       return;
//     }

//     const adminUser = await adminUserRepository.findOne({
//       where: { id: user.userId },
//     });

//     if (!adminUser) {
//       res.status(404).json({
//         status: "failed",
//         message: "User not found.",
//       });
//       return;
//     }

//     const hasPermission = checkActionPermission(
//       "manage_warehouse",
//       adminUser?.adminGroupsId
//     );

//     if (!hasPermission) {
//       res.status(403).json({
//         status: "failed",
//         message: "You don't have permission to perform this action.",
//       });
//       return;
//     }

//     const stocks = await warehouseStockRepository.find({
//       where: { warehouseId },
//       relations: ["productVariant"],
//     });

//     res.status(200).json({
//       status: "success",
//       data: stocks,
//     });
//   } catch (error: any) {
//     console.error("Error fetching warehouse stocks:", error);
//     res.status(500).json({
//       status: "failed",
//       message: error?.message || "Internal server error.",
//     });
//   }
// }
// export const getWarehouseDetails = async (req: Request, res: Response) => {
//   try {
//     const { warehouseId, user } = req.body;

//     if (!warehouseId) {
//       res.status(400).json({
//         status: "failed",
//         message: "warehouseId is required.",
//       });
//       return;
//     }

//     const adminUser = await adminUserRepository.findOne({
//       where: { id: user.userId },
//     });

//     if (!adminUser) {
//       res.status(404).json({
//         status: "failed",
//         message: "User not found.",
//       });
//       return;
//     }

//     const hasPermission = checkActionPermission(
//       "manage_warehouse",
//       adminUser?.adminGroupsId
//     );

//     if (!hasPermission) {
//       res.status(403).json({
//         status: "failed",
//         message: "You don't have permission to perform this action.",
//       });
//       return;
//     }

//     const warehouse = await warehouseRepository.findOne({
//       where: { id: warehouseId },
//     });

//     if (!warehouse) {
//       res.status(404).json({
//         status: "failed",
//         message: "Warehouse not found.",
//       });
//       return;
//     }

//     res.status(200).json({
//       status: "success",
//       data: warehouse,
//     });
//   } catch (error: any) {
//     console.error("Error fetching warehouse details:", error);
//     res.status(500).json({
//       status: "failed",
//       message: error?.message || "Internal server error.",
//     });
//   }
// }
