import { Field, ID, ObjectType } from "type-graphql";
import { Product } from "../../entities/Product.js";

@ObjectType()
class Categories {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  rank: number;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  metaData: object;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  deletedAt: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class GetAllCategoriesResponse {
  @Field(() => [Categories], { nullable: true })
  categories?: Categories[];

  @Field({ nullable: true })
  error?: string;
}
@ObjectType()
export class GetAllProductsForCategoryResponse {
  @Field(() => [Product], { nullable: true })
  products?: Product[];

  @Field({ nullable: true })
  error?: string;
}
