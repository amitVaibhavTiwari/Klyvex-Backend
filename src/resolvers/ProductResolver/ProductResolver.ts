import { Resolver, Query, Arg, Info } from "type-graphql";
import { productRepository } from "../../repositories/repositories.js";
import { Product } from "../../entities/Product.js";
import {
  GetAllProductsResponse,
  GetFeaturedProductsResponse,
  GetProductBySlugResponse,
  ProductSortEnum,
} from "./types.js";
import type { GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { GraphQLJSONObject } from "graphql-type-json";
import { getSelectedFields } from "../../utils/getSelectedFields.js";

@Resolver(Product)
export class ProductResolver {
  @Query(() => GetAllProductsResponse)
  async getAllProducts(
    @Info() info: GraphQLResolveInfo,
    @Arg("warehouseId") warehouseId: number,
    @Arg("categoryId", { nullable: true }) categoryId?: number,
    @Arg("limit", { nullable: true }) limit?: number,
    @Arg("page", { nullable: true }) page?: number,
    @Arg("isDefault", { nullable: true }) isDefault?: boolean,
    @Arg("stockAvailable", { nullable: true }) stockAvailale?: boolean,
    @Arg("attributeFilter", () => GraphQLJSONObject, { nullable: true })
    attributeFilter?: Record<string, string>,
    @Arg("minPrice", { nullable: true }) minPrice?: number,
    @Arg("maxPrice", { nullable: true }) maxPrice?: number,
    @Arg("sortBy", () => ProductSortEnum, { nullable: true })
    sortBy?: ProductSortEnum
  ): Promise<GetAllProductsResponse> {
    try {
      const take = limit ?? 20;
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * take;

      const fields = graphqlFields(info);
      const selectedProductFields = getSelectedFields({
        fields: fields.data,
        alias: "product",
      });

      // this is required for sorting product based on created AT (don't remove)
      if (sortBy === ProductSortEnum.NEWEST) {
        selectedProductFields["product_createdAt"] = "product.createdAt";
      }

      const query = productRepository
        .createQueryBuilder("product")
        .take(take)
        .skip(skip)
        .select(Object.values(selectedProductFields));

      query
        .innerJoin("product.ProductVariant", "variant")
        .innerJoin(
          "variant.WarehouseStock",
          "stock",
          "stock.warehouseId = :warehouseId",
          { warehouseId }
        );

      if (stockAvailale) {
        query.andWhere("stock.stockQuantity > 0");
      }

      if (categoryId) {
        query
          .innerJoin("product.categories", "relation")
          .innerJoin("relation.category", "category")
          .andWhere("category.id = :categoryId", { categoryId });
      }

      if (isDefault) {
        query.andWhere("variant.isDefault = :isDefault", { isDefault });
      }

      if (attributeFilter && typeof attributeFilter === "object") {
        const entries = Object.entries(attributeFilter).filter(
          ([, v]) => v !== undefined
        );

        if (entries.length) {
          const conditions: string[] = [];
          const params: Record<string, any> = {};

          entries.forEach(([key, value], index) => {
            const keyParam = `attrKey_${index}`;
            const valParam = `attrVal_${index}`;
            conditions.push(
              `variant_sub.attributes ->> :${keyParam} = :${valParam}`
            );
            params[keyParam] = key;
            params[valParam] = value;
          });

          const whereClause = conditions.join(" AND ");

          query.andWhere(
            `EXISTS (
            SELECT 1
            FROM product_variant variant_sub
            WHERE variant_sub."productId" = product.id
            AND EXISTS (
              SELECT 1 FROM warehouse_stock ws
              WHERE ws."productVariantId" = variant_sub.id
              AND ws."warehouseId" = :warehouseId
            )
            AND ${whereClause}
          )`,
            {
              warehouseId,
              ...params,
            }
          );
        }
      }

      if (minPrice) {
        query.andWhere(
          `NOT EXISTS (
          SELECT 1
          FROM product_variant variant_sub
          INNER JOIN warehouse_stock ws ON ws."productVariantId" = variant_sub.id
          WHERE variant_sub."productId" = product.id
          AND ws."warehouseId" = :warehouseId
          AND CAST(variant_sub.price ->> 'amount' AS NUMERIC) < :minPrice
        )`,
          { warehouseId, minPrice }
        );
      }

      if (maxPrice) {
        query.andWhere(
          `EXISTS (
          SELECT 1
          FROM product_variant variant_sub
          INNER JOIN warehouse_stock ws ON ws."productVariantId" = variant_sub.id
          WHERE variant_sub."productId" = product.id
          AND ws."warehouseId" = :warehouseId
          AND CAST(variant_sub.price ->> 'amount' AS NUMERIC) <= :maxPrice
        )`,
          { warehouseId, maxPrice }
        );
      }

      if (
        sortBy === ProductSortEnum.PRICE_LOW_TO_HIGH ||
        sortBy === ProductSortEnum.PRICE_HIGH_TO_LOW
      ) {
        const sortDirection =
          sortBy === ProductSortEnum.PRICE_LOW_TO_HIGH ? "ASC" : "DESC";

        const subQuery = productRepository
          .createQueryBuilder("product_sub")
          .select("MIN(CAST(variant_sub.price ->> 'amount' AS NUMERIC))")
          .from("product_variant", "variant_sub")
          .innerJoin(
            "warehouse_stock",
            "ws_sub",
            "ws_sub.productVariantId = variant_sub.id AND ws_sub.warehouseId = :warehouseId"
          )
          .where("variant_sub.productId = product.id")
          .getQuery(); // this returns raw SQL string

        query.addSelect(`(${subQuery})`, "min_price");
        query.addOrderBy(`min_price`, sortDirection);
      } else if (sortBy === ProductSortEnum.NEWEST) {
        query.addOrderBy("product.createdAt", "DESC");
      }

      if (fields.data.ProductVariant || fields.data.variants) {
        const variantFields = getSelectedFields({
          fields: fields.data.ProductVariant || fields.data.variants,
          alias: "variant",
        });

        if (Object.keys(variantFields).length) {
          query.addSelect(Object.values(variantFields));
        }

        if (
          fields.data.ProductVariant?.WarehouseStock ||
          fields.data.ProductVariant?.warehouseStock
        ) {
          const stockFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.WarehouseStock ||
              fields.data.ProductVariant?.warehouseStock,
            alias: "stock",
          });
          query.addSelect(Object.values(stockFields));
        }

        if (
          fields.data.ProductVariant?.ProductImage ||
          fields.data.ProductVariant?.images
        ) {
          query.leftJoin("variant.ProductImage", "variantImage");
          const imageFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.ProductImage ||
              fields.data.ProductVariant?.images,
            alias: "variantImage",
          });
          query.addSelect(Object.values(imageFields));
        }
      }

      query.setParameters({ warehouseId });

      const total = await query.getCount();
      const totalPages = Math.ceil(total / take);
      const hasMore = currentPage < totalPages;
      const data: any = await query.getMany();

      return {
        data,
        total,
        currentPage,
        totalPages,
        hasMore,
      };
    } catch (error: any) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  @Query(() => GetFeaturedProductsResponse)
  async getFeaturedProducts(
    @Info() info: GraphQLResolveInfo,
    @Arg("productIds", () => [String]) productIds: string[],
    @Arg("warehouseId") warehouseId: number,
    @Arg("stockAvailable", { nullable: true }) stockAvailable?: boolean
  ): Promise<GetFeaturedProductsResponse> {
    try {
      const fields = graphqlFields(info);
      const selectedProductFields = getSelectedFields({
        fields: fields.data,
        alias: "product",
      });

      const query = productRepository
        .createQueryBuilder("product")
        .select(Object.values(selectedProductFields))
        .where("product.id IN (:...productIds)", { productIds });

      query
        .innerJoin("product.ProductVariant", "variant")
        .innerJoin(
          "variant.WarehouseStock",
          "stock",
          "stock.warehouseId = :warehouseId",
          { warehouseId }
        );

      if (stockAvailable) {
        query.andWhere("stock.stockQuantity > 0");
      }

      query.andWhere(
        `EXISTS (
      SELECT 1
      FROM product_variant variant_sub
      INNER JOIN warehouse_stock ws_sub
        ON ws_sub."productVariantId" = variant_sub.id
      WHERE variant_sub."productId" = product.id
      AND ws_sub."warehouseId" = :warehouseId
    )`,
        { warehouseId }
      );

      if (fields.data.ProductVariant || fields.data.variants) {
        const variantFields = getSelectedFields({
          fields: fields.data.ProductVariant || fields.data.variants,
          alias: "variant",
        });

        if (Object.keys(variantFields).length) {
          query.addSelect(Object.values(variantFields));
        }

        if (
          fields.data.ProductVariant?.WarehouseStock ||
          fields.data.ProductVariant?.warehouseStock
        ) {
          const stockFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.WarehouseStock ||
              fields.data.ProductVariant?.warehouseStock,
            alias: "stock",
          });
          query.addSelect(Object.values(stockFields));
        }

        if (
          fields.data.ProductVariant?.ProductImage ||
          fields.data.ProductVariant?.images
        ) {
          query.leftJoin("variant.ProductImage", "variantImage");
          const imageFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.ProductImage ||
              fields.data.ProductVariant?.images,
            alias: "variantImage",
          });
          query.addSelect(Object.values(imageFields));
        }
      }

      const data: any = await query.getMany();
      return {
        data,
      };
    } catch (error: any) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  @Query(() => GetProductBySlugResponse, { nullable: true })
  async getProductBySlug(
    @Info() info: GraphQLResolveInfo,
    @Arg("slug") slug: string,
    @Arg("warehouseId") warehouseId: number,
    @Arg("stockAvailable", { nullable: true }) stockAvailable?: boolean
  ): Promise<GetProductBySlugResponse> {
    try {
      const productExists = await productRepository.findOne({
        where: { slug },
      });
      if (!productExists) {
        return {
          error: "Product not found.",
        };
      }

      const fields = graphqlFields(info);
      const selectedProductFields = getSelectedFields({
        fields: fields.data,
        alias: "product",
      });

      const query = productRepository
        .createQueryBuilder("product")
        .select(Object.values(selectedProductFields))
        .where("product.slug = :slug", { slug });

      query
        .innerJoin("product.ProductVariant", "variant")
        .innerJoin(
          "variant.WarehouseStock",
          "stock",
          "stock.warehouseId = :warehouseId",
          { warehouseId }
        );

      if (stockAvailable) {
        query.andWhere("stock.stockQuantity > 0");
      }

      query.andWhere(
        `EXISTS (
      SELECT 1
      FROM product_variant variant_sub
      INNER JOIN warehouse_stock ws_sub
        ON ws_sub."productVariantId" = variant_sub.id
      WHERE variant_sub."productId" = product.id
      AND ws_sub."warehouseId" = :warehouseId
    )`,
        { warehouseId }
      );

      if (fields.data.ProductVariant || fields.data.variants) {
        const variantFields = getSelectedFields({
          fields: fields.data.ProductVariant || fields.data.variants,
          alias: "variant",
        });

        if (Object.keys(variantFields).length) {
          query.addSelect(Object.values(variantFields));
        }

        if (
          fields.data.ProductVariant?.WarehouseStock ||
          fields.data.ProductVariant?.warehouseStock
        ) {
          const stockFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.WarehouseStock ||
              fields.data.ProductVariant?.warehouseStock,
            alias: "stock",
          });
          query.addSelect(Object.values(stockFields));
        }
        if (
          fields.data.ProductVariant?.ProductImage ||
          fields.data.ProductVariant?.images
        ) {
          query.leftJoin("variant.ProductImage", "variantImage");
          const imageFields = getSelectedFields({
            fields:
              fields.data.ProductVariant?.ProductImage ||
              fields.data.ProductVariant?.images,
            alias: "variantImage",
          });
          query.addSelect(Object.values(imageFields));
        }
      }
      const data: any = await query.getOne();
      return {
        data: data,
      };
    } catch (error: any) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
