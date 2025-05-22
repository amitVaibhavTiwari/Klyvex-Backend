import { Resolver, Query, Arg } from "type-graphql";
import {
  productRepository,
  productVariantRepository,
} from "../../repositories/repositories.js";
import { Product } from "../../entities/Product.js";
import {
  GetAllProductsForCategoryResponse,
  getSingleProductResponse,
} from "./types.js";
@Resolver(Product)
export class ProductResolver {
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
        //selecting the variants that have stock in the specified warehouse
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

  @Query(() => getSingleProductResponse, { nullable: true })
  async getSingleProduct(
    @Arg("productId") productId: string,
    @Arg("warehouseId") warehouseId: number
  ): Promise<getSingleProductResponse> {
    try {
      // getting the product
      const product = await productRepository
        .createQueryBuilder("product")
        .where("product.id = :productId", { productId })
        .leftJoinAndSelect("product.categories", "categoryRelation")
        .leftJoinAndSelect("categoryRelation.category", "category")
        .getOne();

      if (!product) {
        return {
          error: "Product not found.",
        };
      }

      // getting the variants with stock in the specified warehouse
      const variantsWithStock = await productVariantRepository
        .createQueryBuilder("variant")
        .where("variant.Product = :productId", { productId })
        .innerJoin(
          "variant.WarehouseStock",
          "stock",
          "stock.Warehouse.id = :warehouseId AND stock.stockQuantity > 0",
          { warehouseId }
        )
        .leftJoinAndSelect(
          "variant.WarehouseStock",
          "fullStock",
          "fullStock.Warehouse.id = :warehouseId",
          { warehouseId }
        )
        .leftJoinAndSelect("variant.ProductImage", "variantImage")
        .getMany();

      // Assign the filtered variants to the product
      product.ProductVariant = variantsWithStock;

      return {
        product: product,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
