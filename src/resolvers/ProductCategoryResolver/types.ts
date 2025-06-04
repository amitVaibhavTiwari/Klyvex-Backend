import { Field, ID, ObjectType } from "type-graphql";
import { GraphQLJSON } from "graphql-type-json";

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

  @Field(() => GraphQLJSON, { nullable: true })
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
