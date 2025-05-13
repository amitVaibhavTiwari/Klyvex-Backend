import { Request, Response } from "express";
import {
  adminUserRepository,
  productCategoryRepository,
} from "../../repositories/repositories.js";
import { AppDataSource } from "../../dataSource/dataSource.js";
import { checkActionPermission } from "../../utils/checkPermission.js";

export const addNewProduct = async ({ req, res }: any) => {
  try {
    // const product = new Product();
    // const productCategory = new ProductCategory();
    // const productCategoryRelation = new ProductCategoryRelation();

    // product.name = "Product Name";
    // product.description = "Product Description";
    // product.price = 100;
    // product.stock = 50;

    // productCategory.name = "Category Name";

    // productCategoryRelation.product = product;
    // productCategoryRelation.category = productCategory;

    // await productRepository.save(product);
    // await productCategoryRepository.save(productCategory);
    // await productCategoryRelationRepository.save(productCategoryRelation);

    return res.send({
      message: "Product added successfully",
      status: true,
    });
  } catch (error: any) {
    return {
      message: error?.message || "boo",
      status: false,
    };
  }
};

export const addNewProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.name || !req.body.slug || !req.body.description) {
      throw new Error("Name, slug and description are required");
    }

    const user = await adminUserRepository.findOne({
      where: {
        id: req?.body?.user?.userId,
      },
      relations: ["AdminGroups"],
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const hasPermission = checkActionPermission(
      "manage_products",
      user?.AdminGroups?.id
    );

    if (!hasPermission) {
      throw new Error("You don't have permission to perform this action.");
    }

    const existingCategory = await productCategoryRepository.findOneBy({
      name: req.body.name,
    });

    if (existingCategory) {
      throw new Error("Category name already exists.");
    }

    const newCategory = productCategoryRepository.create({
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    });

    if (req.body.metaData) {
      newCategory.metaData = req.body.metaData;
    }

    await productCategoryRepository.save(newCategory);

    res.status(201).json({
      status: "success",
      message: "Product Category created successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error?.message || "Error creating super admin.",
    });
  }
};
