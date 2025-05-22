import { Resolver, Query, Arg } from "type-graphql";
import { productCategoryRepository } from "../../repositories/repositories.js";

import { ProductCategory } from "../../entities/ProductCategory.js";
import { GetAllCategoriesResponse } from "./types.js";

@Resolver(ProductCategory)
export class ProductCategoryResolver {
  @Query(() => GetAllCategoriesResponse, { nullable: true })
  async getAllCategories(): Promise<GetAllCategoriesResponse> {
    try {
      const productCategories = await productCategoryRepository.find({
        // relations: [
        //   "products",
        //   "products.product",
        //   "products.product.ProductVariant",
        //   "products.product.ProductVariant.ProductImage",
        // ],
      });
      return {
        categories: productCategories,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
