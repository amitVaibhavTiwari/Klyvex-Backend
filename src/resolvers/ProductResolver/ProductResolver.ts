import { Resolver, Query, Arg, Info } from "type-graphql";
import {
  productRepository,
  productVariantRepository,
} from "../../repositories/repositories.js";
import { Product } from "../../entities/Product.js";
import {
  GetAllProductsForCategoryResponse,
  getSingleProductResponse,
} from "./types.js";
import type { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";

function getSelectedFields(
  fields: Record<string, any>,
  alias: string,
  excludeRelations: boolean = false
): Record<string, string> {
  const selected: Record<string, string> = {};

  // 🔧 ALWAYS include the primary key for entity identification
  selected[`${alias}_id`] = `${alias}.id`;

  for (const key in fields) {
    const value = fields[key];

    // Skip relation fields when excludeRelations is true
    if (
      excludeRelations &&
      value &&
      typeof value === "object" &&
      Object.keys(value).length > 0
    ) {
      continue;
    }

    // This is a scalar field (leaf node)
    if (
      !value ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      // Don't duplicate the id field
      if (key !== "id") {
        selected[`${alias}_${key}`] = `${alias}.${key}`;
      }
    }
  }

  return selected;
}

@Resolver(Product)
export class ProductResolver {
  // @Query(() => GetAllProductsForCategoryResponse, { nullable: true })
  // async getAllProductsForCategory(
  //   @Arg("categoryId") categoryId: number,
  //   @Arg("limit", { nullable: true }) limit: number,
  //   @Arg("page", { nullable: true }) page: number,
  //   @Arg("warehouseId") warehouseId: number
  // ): Promise<GetAllProductsForCategoryResponse> {
  //   try {
  //     const take = limit ?? undefined;
  //     const skip = limit && page ? (page - 1) * limit : undefined;

  //     const query = productRepository
  //       .createQueryBuilder("product")
  //       .innerJoin("product.categories", "relation")
  //       .innerJoin("relation.category", "category")
  //       .innerJoin("product.ProductVariant", "variant")
  //       .innerJoin("variant.WarehouseStock", "stock")
  //       .where("category.id = :categoryId", { categoryId })
  //       .andWhere("stock.Warehouse.id = :warehouseId", { warehouseId })
  //       .andWhere("stock.stockQuantity > 0")
  //       //selecting the variants that have stock in the specified warehouse
  //       .leftJoinAndSelect(
  //         "product.ProductVariant",
  //         "filteredVariant",
  //         "filteredVariant.id = variant.id"
  //       )
  //       // Join and select the warehouse stock for those filtered variants
  //       .leftJoinAndSelect(
  //         "filteredVariant.WarehouseStock",
  //         "filteredStock",
  //         "filteredStock.Warehouse.id = :warehouseId AND filteredStock.stockQuantity > 0",
  //         { warehouseId }
  //       )
  //       // Join and select the images for the filtered variants
  //       .leftJoinAndSelect("filteredVariant.ProductImage", "variantImage")
  //       .take(take)
  //       .skip(skip);

  //     const products = await query.getMany();

  //     return {
  //       products: products,
  //     };
  //   } catch (error) {
  //     return {
  //       error:
  //         error instanceof Error ? error.message : "Internal Server Error.",
  //     };
  //   }
  // }

  // @Query(() => getSingleProductResponse, { nullable: true })
  // async getSingleProduct(
  //   @Arg("productId") productId: string,
  //   @Arg("warehouseId") warehouseId: number
  // ): Promise<getSingleProductResponse> {
  //   try {
  //     // getting the product
  //     const product = await productRepository
  //       .createQueryBuilder("product")
  //       .where("product.id = :productId", { productId })
  //       .leftJoinAndSelect("product.categories", "categoryRelation")
  //       .leftJoinAndSelect("categoryRelation.category", "category")
  //       .getOne();

  //     if (!product) {
  //       return {
  //         error: "Product not found.",
  //       };
  //     }

  //     // getting the variants with stock in the specified warehouse
  //     const variantsWithStock = await productVariantRepository
  //       .createQueryBuilder("variant")
  //       .where("variant.Product = :productId", { productId })
  //       .innerJoin(
  //         "variant.WarehouseStock",
  //         "stock",
  //         "stock.Warehouse.id = :warehouseId AND stock.stockQuantity > 0",
  //         { warehouseId }
  //       )
  //       .leftJoinAndSelect(
  //         "variant.WarehouseStock",
  //         "fullStock",
  //         "fullStock.Warehouse.id = :warehouseId",
  //         { warehouseId }
  //       )
  //       .leftJoinAndSelect("variant.ProductImage", "variantImage")
  //       .getMany();

  //     // Assign the filtered variants to the product
  //     product.ProductVariant = variantsWithStock;

  //     return {
  //       product: product,
  //     };
  //   } catch (error) {
  //     return {
  //       error:
  //         error instanceof Error ? error.message : "Internal Server Error.",
  //     };
  //   }
  // }

  @Query(() => [Product], { nullable: true })
  async getAllProducts(
    @Info() info: GraphQLResolveInfo,
    @Arg("warehouseId") warehouseId: number,
    @Arg("categoryId", { nullable: true }) categoryId?: number,
    @Arg("limit", { nullable: true }) limit?: number,
    @Arg("page", { nullable: true }) page?: number
  ): Promise<Product[]> {
    const take = limit ?? 20;
    const skip = limit && page ? (page - 1) * limit : 0;

    const fields = graphqlFields(info);
    const selectedProductFields = getSelectedFields(fields, "product");

    const query = productRepository
      .createQueryBuilder("product")
      .take(take)
      .skip(skip)
      .select(Object.values(selectedProductFields));

    // we'll always apply warehouse filtering to get only those products which are available in warehouse (required for business logic)
    query
      .innerJoin("product.ProductVariant", "variant")
      .innerJoin(
        "variant.WarehouseStock",
        "stock",
        "stock.warehouseId = :warehouseId AND stock.stockQuantity > 0",
        { warehouseId }
      );

    //  category filtering if requested
    if (categoryId) {
      query
        .innerJoin("product.categories", "relation")
        .innerJoin("relation.category", "category")
        .andWhere("category.id = :categoryId", { categoryId });
    }

    // ProductVariant fields if requested by client
    if (fields.ProductVariant || fields.variants) {
      const variantFields = getSelectedFields(
        fields.ProductVariant || fields.variants,
        "variant"
      );

      if (Object.keys(variantFields).length) {
        query.addSelect(Object.values(variantFields));
      }

      //  WarehouseStock fields if requested
      if (
        fields.ProductVariant?.WarehouseStock ||
        fields.ProductVariant?.warehouseStock
      ) {
        const stockFields = getSelectedFields(
          fields.ProductVariant?.WarehouseStock ||
            fields.ProductVariant?.warehouseStock,
          "stock"
        );
        query.addSelect(Object.values(stockFields));
      }

      //  ProductImage fields if requested
      if (
        fields.ProductVariant?.ProductImage ||
        fields.ProductVariant?.images
      ) {
        query.leftJoin("variant.ProductImage", "variantImage");
        const imageFields = getSelectedFields(
          fields.ProductVariant?.ProductImage || fields.ProductVariant?.images,
          "variantImage"
        );
        query.addSelect(Object.values(imageFields));
      }
    }

    console.log("Generated SQL:", query.getSql());
    return query.getMany();
  }
}
