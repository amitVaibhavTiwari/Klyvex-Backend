import { Request, Response } from "express";
import {
  productCategoryRelationRepository,
  productCategoryRepository,
  productImageRepository,
  productRepository,
  productTypeRepository,
  productVariantRepository,
  warehouseStockRepository,
} from "../../../repositories/repositories.js";
import { PermissionEnum } from "../../utils/Permissions.js";
import {
  AddNewProductCategoryDTO,
  AddNewProductDTO,
  AddNewProductTypeDTO,
  AddNewVariantToProductDTO,
  AddProductToCategoryDTO,
  DeleteProductCategoryDTO,
  DeleteProductDTO,
  DeleteProductFromCategoryDTO,
  DeleteVariantFromProductDTO,
  EditProductVariantDTO,
} from "./DTOs.js";
import { validateDTO } from "../../utils/validateDto.js";
import { validateAdminUser } from "../../utils/validateAdminUser.js";
import { AppDataSource } from "../../../dataSource/dataSource.js";

export const addNewProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    slug,
    description,
    isActive,
    metaData,

    user,
    parentCategoryId,
  } = await validateDTO(AddNewProductCategoryDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const existingCategory = await productCategoryRepository.findOne({
    where: { name },
  });

  if (existingCategory) {
    res.status(409).json({
      status: "failed",
      message: "Category name already exists.",
    });
    return;
  }

  if (parentCategoryId) {
    const existingParentCategory = await productCategoryRepository.findOneBy({
      id: parentCategoryId,
    });

    if (!existingParentCategory) {
      res.status(404).json({
        status: "failed",
        message: "Parent category not found.",
      });
      return;
    }
  }

  const newCategory = productCategoryRepository.create({
    name,
    slug,
    description,
    isActive,
    metaData: metaData,
    parentCategoryId: parentCategoryId || undefined,
  });

  await productCategoryRepository.save(newCategory);

  res.status(201).json({
    status: "success",
    message: "Product category created successfully.",
  });
};

export const createProductType = async (req: Request, res: Response) => {
  const { name, productAttributes, variantAttributes, user } =
    await validateDTO(AddNewProductTypeDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);
  const existingProductType = await productTypeRepository.findOne({
    where: { name },
  });
  if (existingProductType) {
    res.status(409).json({
      status: "failed",
      message: "Product type with this name already exists.",
    });
    return;
  }
  const newProductType = productTypeRepository.create({
    name,
    productAttributes,
    variantAttributes,
  });
  await productTypeRepository.save(newProductType);
  res.status(201).json({
    status: "success",
    message: "Product type created successfully.",
  });
};

export const addNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    name,
    slug,
    price,
    categoryId,
    productAttributes,
    variantAttributes,
    tax,
    sku,
    description,
    productTypeId,
    images,
    thumbnail,
    user,
  } = await validateDTO(AddNewProductDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const existingProduct = await productRepository.find({
    where: [{ slug: slug }, { name: name }],
  });

  if (existingProduct.length > 0) {
    res.status(409).json({
      status: "failed",
      message: "Product with this slug or name already exists.",
    });
    return;
  }

  const existingVariant = await productVariantRepository.find({
    where: { sku: sku },
  });

  if (existingVariant.length > 0) {
    res.status(409).json({
      status: "failed",
      message: "Variant with this sku already exists.",
    });
    return;
  }

  await productRepository.manager.transaction(
    async (transactionalEntityManager) => {
      const newProduct = productRepository.create({
        name,
        slug,
        thumbnail: thumbnail,
        productTypeId,
        description,
        attributes: productAttributes,
      });
      const savedProduct = await transactionalEntityManager.save(newProduct);

      const newVariant = productVariantRepository.create({
        price,
        sku,
        attributes: variantAttributes,
        isDefault: true,
        tax,
        productId: savedProduct.id,
      });

      const savedVariant = await transactionalEntityManager.save(newVariant);

      //adding category if provided
      if (categoryId) {
        const productCategory = await productCategoryRepository.findOneBy({
          id: categoryId,
        });

        if (!productCategory) {
          res.status(404).json({
            status: "failed",
            message: "Product category not found.",
          });
          return;
        }
        const productCategoryRelation =
          productCategoryRelationRepository.create({
            categoryId: productCategory.id,
            productId: savedProduct.id,
          });

        await transactionalEntityManager.save(productCategoryRelation);
      }

      if (Array.isArray(images) && images.length > 0) {
        const imageEntities = images.map((image: string, index: number) =>
          productImageRepository.create({
            imageUrl: image,
            rank: (index + 1).toString(),
            productId: savedProduct.id,
            productVariantId: savedVariant.id,
          })
        );
        await transactionalEntityManager.save(imageEntities);
      }
    }
  );

  res.status(201).json({
    status: "success",
    message: "Product created successfully.",
  });
};

export const addProductToCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId, categoryId, user } = await validateDTO(
    AddProductToCategoryDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const productCategory = await productCategoryRepository.findOneBy({
    id: categoryId,
  });

  if (!productCategory) {
    res.status(404).json({
      status: "failed",
      message: "Product category not found.",
    });
    return;
  }

  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    res.status(404).json({
      status: "failed",
      message: "Product not found.",
    });
    return;
  }

  const existingRelation = await productCategoryRelationRepository.findOneBy({
    categoryId: categoryId,
    productId: productId,
  });

  if (existingRelation) {
    res.status(409).json({
      status: "failed",
      message:
        "Product is already linked to this category. Please choose another category.",
    });
    return;
  }

  const newRelation = productCategoryRelationRepository.create({
    categoryId: productCategory.id,
    productId: product.id,
  });

  await productCategoryRelationRepository.save(newRelation);

  res.status(201).json({
    status: "success",
    message: "Product added to category successfully.",
  });
};

export const deleteProductFromCategory = async (
  req: Request,
  res: Response
) => {
  const { productId, categoryId, user } = await validateDTO(
    DeleteProductFromCategoryDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const productCategory = await productCategoryRepository.findOneBy({
    id: categoryId,
  });

  if (!productCategory) {
    res.status(404).json({
      status: "failed",
      message: "Product category not found.",
    });
    return;
  }

  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    res.status(404).json({
      status: "failed",
      message: "Product not found.",
    });
    return;
  }

  const existingRelation = await productCategoryRelationRepository.findOneBy({
    categoryId: categoryId,
    productId: productId,
  });

  if (!existingRelation) {
    res.status(404).json({
      status: "failed",
      message:
        "Product is not linked to this category. Please choose another category.",
    });
    return;
  }

  await productCategoryRelationRepository.remove(existingRelation);

  res.status(200).json({
    status: "success",
    message: "Product removed from category successfully.",
  });
};

export const addNewVariantToProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { productId, price, tax, attributes, sku, images, user, isDefault } =
    await validateDTO(AddNewVariantToProductDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const product = await productRepository.findOneBy({
    id: productId,
  });

  if (!product) {
    res.status(404).json({
      status: "failed",
      message: "Product not found.",
    });
    return;
  }

  const existingVariant = await productVariantRepository.findOneBy({
    sku: sku,
  });
  if (existingVariant) {
    res.status(409).json({
      status: "failed",
      message: "Variant with this SKU already exists.",
    });
    return;
  }

  await productVariantRepository.manager.transaction(
    async (transactionalEntityManager) => {
      if (isDefault) {
        //means user wants to make this variant as default, so before that if there's already a default variant, we need to remove that isDefault status from it
        const existingDefaultVariant = await productVariantRepository.findOne({
          where: { productId: product.id, isDefault: true },
        });
        if (existingDefaultVariant) {
          existingDefaultVariant.isDefault = false;
          await transactionalEntityManager.save(existingDefaultVariant);
        }
      }

      const newVariant = productVariantRepository.create({
        price: price,
        attributes,
        tax,
        isDefault,
        sku,
        productId: product.id,
      });
      const savedVariant = await transactionalEntityManager.save(newVariant);

      if (Array.isArray(images) && images.length > 0) {
        const imageEntities = images.map((image: string, index: number) =>
          productImageRepository.create({
            imageUrl: image,
            rank: (index + 1).toString(),
            productId: product.id,
            productVariantId: savedVariant.id,
          })
        );
        await transactionalEntityManager.save(imageEntities);
      }
    }
  );

  res.status(201).json({
    status: "success",
    message: "Product variant added successfully.",
  });
};

//untested ones below

export const deleteVariantFromProduct = async (req: Request, res: Response) => {
  const { variantId, user } = await validateDTO(
    DeleteVariantFromProductDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const productVariant = await productVariantRepository.findOneBy({
    id: variantId,
  });

  if (!productVariant) {
    res.status(404).json({
      status: "failed",
      message: "Product variant not found.",
    });
    return;
  }

  if (productVariant.isDefault) {
    res.status(400).json({
      status: "failed",
      message:
        "Cannot delete the default variant. Please set another variant as default first.",
    });
    return;
  }
  // if there are any stock entries for this variant in any warehouse it should not be deleted
  const stocks = await warehouseStockRepository.find({
    where: { productVariantId: productVariant.id },
  });

  if (stocks.length > 0) {
    stocks.map((stock) => {
      if (stock.stockQuantity > 0) {
        res.status(400).json({
          status: "failed",
          message:
            "Cannot delete the variant as it has stock in one or more warehouses.",
        });
        return;
      }
    });
  }

  productVariant.isActive = false;
  await productVariantRepository.save(productVariant);

  res.status(200).json({
    status: "success",
    message: "Product variant deleted successfully.",
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { productId, user } = await validateDTO(DeleteProductDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);
  const product = await productRepository.findOneBy({ id: productId });

  if (!product) {
    res.status(404).json({
      status: "failed",
      message: "Product not found.",
    });
    return;
  }

  const productVariants = await productVariantRepository.find({
    where: { productId: product.id },
  });

  if (productVariants.length > 0) {
    productVariants.map((variant) => {
      if (variant.isActive) {
        res.status(400).json({
          status: "failed",
          message:
            "Cannot delete the product as it has active variants. Please delete the variants first.",
        });
        return;
      }
    });
  }

  product.isActive = false;
  await productRepository.save(product);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully.",
  });
};

export const deleteProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId, user } = await validateDTO(
    DeleteProductCategoryDTO,
    req.body
  );
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  const productCategory = await productCategoryRepository.findOneBy({
    id: categoryId,
  });

  if (!productCategory) {
    res.status(404).json({
      status: "failed",
      message: "Product category not found.",
    });
    return;
  }

  const productRelations = await productCategoryRelationRepository.find({
    where: { categoryId: productCategory.id },
  });
  if (productRelations.length > 0) {
    res.status(400).json({
      status: "failed",
      message:
        "Cannot delete the category as it has products linked to it. Please unlink the products first.",
    });
    return;
  }

  await productCategoryRepository.remove(productCategory);
  res.status(200).json({
    status: "success",
    message: "Product category deleted successfully.",
  });
};

export const editProductVariant = async (req: Request, res: Response) => {
  const { variantId, price, tax, sku, attributes, images, user } =
    await validateDTO(EditProductVariantDTO, req.body);
  await validateAdminUser(user.userId, PermissionEnum.manage_products);

  await AppDataSource.transaction(async (manager) => {
    const productVariantRepo = manager.withRepository(productVariantRepository);
    const productImageRepo = manager.withRepository(productImageRepository);

    const productVariant = await productVariantRepo.findOneBy({
      id: variantId,
    });

    if (!productVariant) {
      res.status(404).json({
        status: "failed",
        message: "Product variant not found.",
      });
      return;
    }

    const { productId } = productVariant;

    if (price !== undefined) productVariant.price = price;
    if (tax !== undefined) productVariant.tax = tax;
    if (sku !== undefined) productVariant.sku = sku;
    if (attributes !== undefined) productVariant.attributes = attributes;

    await productVariantRepo.save(productVariant);

    if (Array.isArray(images)) {
      // old images will be deleted and new will be added
      await productImageRepo.delete({ productVariantId: variantId });

      if (images.length > 0) {
        const imageEntities = images.map((imageUrl: string, index: number) =>
          productImageRepo.create({
            imageUrl,
            rank: (index + 1).toString(),
            productId,
            productVariantId: variantId,
          })
        );
        await productImageRepo.save(imageEntities);
      }
    }

    res.status(200).json({
      status: "success",
      message: "Product variant updated successfully.",
    });
  });
};
