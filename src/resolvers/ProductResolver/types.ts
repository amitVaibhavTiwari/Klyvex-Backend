import { Field, ID, ObjectType } from "type-graphql";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
class ProductImagexx {
  @Field(() => ID)
  id: number;

  @Field()
  imageUrl: string;

  @Field(() => String, { nullable: true })
  rank: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metaData: object;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
class WarehouseStockxx {
  @Field(() => ID)
  id: number;

  @Field()
  stockQuantity: number;

  @Field()
  isActive: boolean;

  @Field()
  reservedQuantity: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metaData: object;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
class ProductVariantxx {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  price: object;

  @Field(() => GraphQLJSON, { nullable: true })
  tax: object;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  size: string;

  @Field({ nullable: true })
  height: string;

  @Field({ nullable: true })
  width: string;

  @Field({ nullable: true })
  length: string;

  @Field({ nullable: true })
  weight: string;

  @Field({ nullable: true })
  color: string;

  @Field()
  allowBackorder: boolean;

  @Field(() => [ProductImagexx])
  ProductImage: ProductVariantxx[];

  @Field(() => [WarehouseStockxx])
  WarehouseStock: WarehouseStockxx[];

  @Field(() => GraphQLJSON, { nullable: true })
  metaData: object;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
@ObjectType()
class Productxx {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metaData: object;

  // this may be added in future so in that case create an extra class for ProductCategoryRelation
  // @Field(() => [ProductCategoryRelation])
  // categories: Relation<ProductCategoryRelation[]>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ProductVariantxx])
  ProductVariant: ProductVariantxx[];
}

@ObjectType()
export class getSingleProductResponse {
  @Field(() => Productxx, { nullable: true })
  product?: Productxx;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class GetAllProductsForCategoryResponse {
  @Field(() => [Productxx], { nullable: true })
  products?: Productxx[];

  @Field({ nullable: true })
  error?: string;
}
