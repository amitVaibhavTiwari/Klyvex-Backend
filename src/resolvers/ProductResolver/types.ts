import { Field, ObjectType } from "type-graphql";
import { Product } from "../../entities/Product.js";

@ObjectType()
export class getSingleProductResponse {
  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field({ nullable: true })
  error?: string;
}
@ObjectType()
export class test {
  @Field(() => String, { nullable: true })
  message: string;
}
