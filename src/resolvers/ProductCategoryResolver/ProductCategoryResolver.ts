import { Resolver, Query, Arg, Info } from "type-graphql";
import { productCategoryRepository } from "../../repositories/repositories.js";

import { ProductCategory } from "../../entities/ProductCategory.js";
import { GetAllCategoriesResponse } from "./types.js";
import { type GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { getSelectedFields } from "../../utils/getSelectedFields.js";

@Resolver(ProductCategory)
export class ProductCategoryResolver {
  @Query(() => GetAllCategoriesResponse, { nullable: true })
  async getProductCategories(
    @Info() info: GraphQLResolveInfo
  ): Promise<GetAllCategoriesResponse> {
    try {
      const fields = graphqlFields(info);
      const selectedFields = getSelectedFields({
        fields: fields.categories,
        alias: "",
        includePrimaryKey: false,
      });
      const productCategories = await productCategoryRepository.find({
        select: Object.values(selectedFields) as (keyof ProductCategory)[],
        order: {
          rank: "ASC",
        },
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
