import { Field, ObjectType } from "type-graphql";
import { ShopMeta } from "../../entities/ShopMeta.js";

@ObjectType()
export class ShopMetaResponse {
  @Field(() => [ShopMeta], { nullable: true })
  data?: ShopMeta[];

  @Field({ nullable: true })
  error?: string;
}
