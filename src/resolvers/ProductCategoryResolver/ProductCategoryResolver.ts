import { Resolver, Query, Arg } from "type-graphql";
import {
  productCategoryRepository,
  productRepository,
} from "../../repositories/repositories.js";

import { ProductCategory } from "../../entities/ProductCategory.js";
import {
  GetAllCategoriesResponse,
  GetAllProductsForCategoryResponse,
} from "./types.js";
import { ProductVariant } from "../../entities/ProductVariant.js";
import { WarehouseStock } from "../../entities/WarehouseStock.js";

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

  @Query(() => GetAllProductsForCategoryResponse, { nullable: true })
  async getAllProductsForCategory(
    @Arg("categoryId") categoryId: number,
    @Arg("limit", { nullable: true }) limit: number,
    @Arg("page", { nullable: true }) page: number,
    @Arg("warehouseId") warehouseId: number
  ): Promise<GetAllProductsForCategoryResponse> {
    try {
      const take = limit ?? undefined;
      const skip = limit && page ? (page - 1) * limit : undefined;

      const query = productRepository
        .createQueryBuilder("product")
        .innerJoin("product.categories", "relation")
        .innerJoin("relation.category", "category")
        .innerJoin("product.ProductVariant", "variant")
        .innerJoin("variant.WarehouseStock", "stock")
        .where("category.id = :categoryId", { categoryId })
        .andWhere("stock.Warehouse.id = :warehouseId", { warehouseId })
        .andWhere("stock.stockQuantity > 0")
        // Only select the variants that have stock in the specified warehouse
        .leftJoinAndSelect(
          "product.ProductVariant",
          "filteredVariant",
          "filteredVariant.id = variant.id"
        )
        // Join and select the warehouse stock for those filtered variants
        .leftJoinAndSelect(
          "filteredVariant.WarehouseStock",
          "filteredStock",
          "filteredStock.Warehouse.id = :warehouseId AND filteredStock.stockQuantity > 0",
          { warehouseId }
        )
        // Join and select the images for the filtered variants
        .leftJoinAndSelect("filteredVariant.ProductImage", "variantImage")
        .take(take)
        .skip(skip);

      const products = await query.getMany();

      return {
        products: products,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
