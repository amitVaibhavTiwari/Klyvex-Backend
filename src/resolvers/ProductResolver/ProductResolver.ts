import { Resolver, Query, Arg } from "type-graphql";
import {
  productCategoryRepository,
  productRepository,
} from "../../repositories/repositories.js";

import { ProductCategory } from "../../entities/ProductCategory.js";
import { Product } from "../../entities/Product.js";
import { getSingleProductResponse } from "./types.js";

@Resolver(Product)
export class ProductResolver {
  @Query(() => getSingleProductResponse, { nullable: true })
  async getSingleProduct(
    @Arg("productId") productId: string
  ): Promise<getSingleProductResponse> {
    try {
      const product = await productRepository.findOne({
        where: { id: productId },
        relations: ["ProductVariant"],
      });
      if (!product) {
        throw new Error("No Product Found.");
      }
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

  //   @Query(() => test, { nullable: true })
  //   async getTest(): Promise<{ message: string }> {
  //     return {
  //       message: "Hello World",
  //     };
  //   }
}
