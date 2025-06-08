import { Request, Response } from "express";
import {
  adminUserRepository,
  productCategoryRelationRepository,
  productCategoryRepository,
  productImageRepository,
  productRepository,
  productVariantRepository,
} from "../../repositories/repositories.js";
import { checkActionPermission } from "../utils/checkPermission.js";

export const addNewProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, description, isActive, metaData, user } = req.body;
    if (!name || !slug || !description) {
      res.status(400).json({
        status: "failed",
        message: "name, slug, description are required.",
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
      "manage_products",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

    const existingCategory = await productCategoryRepository.findOneBy({
      name,
    });

    if (existingCategory) {
      res.status(409).json({
        status: "failed",
        message: "Category name already exists.",
      });
      return;
    }

    const newCategory = productCategoryRepository.create({
      name,
      slug,
      description,
      isActive,
      metaData: metaData || null,
    });

    await productCategoryRepository.save(newCategory);

    res.status(201).json({
      status: "success",
      message: "Product category created successfully.",
    });
  } catch (error: any) {
    console.error("Error creating product category:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal server error.",
    });
  }
};

export const addNewProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      slug,
      price,
      categoryId,
      productMetaData,
      variantMetaData,
      tax,
      description,
      size,
      color,
      height,
      width,
      weight,
      length,
      images,
      user,
    } = req.body;

    if (!name || !slug || !price || !categoryId) {
      res.status(400).json({
        status: "failed",
        message: "name, slug, price, categoryId are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({ status: "failed", message: "User not found." });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_products",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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

    await productRepository.manager.transaction(
      async (transactionalEntityManager) => {
        try {
          const newProduct = productRepository.create({
            name,
            slug,
            metaData: productMetaData || null,
          });
          const savedProduct = await transactionalEntityManager.save(
            newProduct
          );
          const newVariant = productVariantRepository.create({
            price,
            metaData: variantMetaData || null,
            tax,
            description,
            size,
            color,
            height,
            width,
            weight,
            length,
            Product: savedProduct,
          });

          const savedVariant = await transactionalEntityManager.save(
            newVariant
          );

          const productCategoryRelation =
            productCategoryRelationRepository.create({
              category: productCategory,
              product: savedProduct,
            });
          await transactionalEntityManager.save(productCategoryRelation);

          if (Array.isArray(images) && images.length > 0) {
            const imageEntities = images.map((image: string, index: number) =>
              productImageRepository.create({
                imageUrl: image,
                rank: (index + 1).toString(),
                Product: savedProduct,
                ProductVariant: savedVariant,
              })
            );
            await transactionalEntityManager.save(imageEntities);
          }
        } catch (error) {
          console.error("Error saving product or variant:", error);
          throw new Error("Failed to save product or variant.");
        }
      }
    );

    res.status(201).json({
      status: "success",
      message: "Product created successfully.",
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal Server Error.",
    });
  }
};

export const addProductToCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, categoryId, user } = req.body;

    if (!productId || !categoryId) {
      res.status(400).json({
        status: "failed",
        message: "productId and categoryId are required.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({ status: "failed", message: "User not found." });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_products",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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
      category: { id: categoryId },
      product: { id: productId },
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
      category: productCategory,
      product,
    });

    await productCategoryRelationRepository.save(newRelation);

    res.status(201).json({
      status: "success",
      message: "Product added to collection successfully.",
    });
  } catch (error: any) {
    console.error("Error adding product to collection:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal server error.",
    });
  }
};

export const addNewVariantToProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      productId,
      price,
      metadata,
      tax,
      description,
      size,
      color,
      height,
      width,
      weight,
      length,
      images,
      user,
    } = req.body;

    if (!productId) {
      res.status(400).json({
        status: "failed",
        message: "productId is required.",
      });
      return;
    }

    if (
      !price &&
      !metadata &&
      !tax &&
      !description &&
      !size &&
      !color &&
      !height &&
      !width &&
      !weight &&
      !length
    ) {
      res.status(400).json({
        status: "failed",
        message: "Nothing to add in variant.",
      });
      return;
    }

    const adminUser = await adminUserRepository.findOne({
      where: { id: user.userId },
      relations: ["AdminGroups"],
    });

    if (!adminUser) {
      res.status(404).json({ status: "failed", message: "User not found." });
      return;
    }

    const hasPermission = checkActionPermission(
      "manage_products",
      adminUser?.AdminGroups?.id
    );

    if (!hasPermission) {
      res.status(403).json({
        status: "failed",
        message: "You don't have permission to perform this action.",
      });
      return;
    }

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

    await productVariantRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const newVariant = productVariantRepository.create({
          price,
          metaData: metadata || null,
          tax,
          description,
          size,
          color,
          height,
          width,
          weight,
          length,
          Product: product,
        });
        const savedVariant = await transactionalEntityManager.save(newVariant);

        if (Array.isArray(images) && images.length > 0) {
          const imageEntities = images.map((image: string, index: number) =>
            productImageRepository.create({
              imageUrl: image,
              rank: (index + 1).toString(),
              Product: product,
              ProductVariant: savedVariant,
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
  } catch (error: any) {
    console.error("Error adding product variant:", error);
    res.status(500).json({
      status: "failed",
      message: error?.message || "Internal Server Error.",
    });
  }
};
