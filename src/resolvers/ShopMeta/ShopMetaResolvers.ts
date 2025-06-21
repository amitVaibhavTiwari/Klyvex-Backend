import { Resolver, Query, Arg, Info } from "type-graphql";
import { shopMetaRepository } from "../../repositories/repositories.js";
import { ShopMeta } from "../../entities/ShopMeta.js";
import { type GraphQLResolveInfo } from "graphql";
import graphqlFields from "graphql-fields";
import { getSelectedFields } from "../../utils/getSelectedFields.js";
import { ShopMetaResponse } from "./types.js";

@Resolver(ShopMeta)
export class ShopMetaResolver {
  @Query(() => ShopMetaResponse)
  async getShopMeta(
    @Info() info: GraphQLResolveInfo,
    @Arg("keys", () => [String]) keys: string[]
  ): Promise<ShopMetaResponse> {
    try {
      const fields = graphqlFields(info);
      const selectedFields = getSelectedFields({
        fields: fields.data,
        alias: "",
        includePrimaryKey: false,
      });

      const data = await shopMetaRepository.find({
        where: keys.map((key) => ({ key })),
        select: Object.values(selectedFields) as (keyof ShopMeta)[],
      });

      // adding some extra delay for testing purpose
      // await new Promise((resolve) => setTimeout(resolve, 8000))

      return { data };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
