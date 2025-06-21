import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
class ProductImageResponse {
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
class WarehouseStockResponse {
  @Field(() => ID)
  id: number;

  @Field()
  stockQuantity: number;

  @Field()
  reservedQuantity: string;

  @Field()
  allowBackorder: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  metaData: object;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
class ProductVariantResponse {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  price: object;

  @Field(() => GraphQLJSON, { nullable: true })
  tax: object;

  @Field()
  sku: string;

  @Field()
  isDefault: string;

  @Field(() => GraphQLJSON, { nullable: true })
  attributes: object;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ProductImageResponse])
  ProductImage: ProductVariantResponse[];

  @Field(() => [WarehouseStockResponse])
  WarehouseStock: WarehouseStockResponse[];
}

@ObjectType()
class ProductResponse {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  description: string;

  @Field()
  thumbnail: string;

  @Field(() => GraphQLJSON, { nullable: true })
  attributes: object;

  // this may be added in future so in that case create an extra class for ProductCategoryRelation
  // @Field(() => [ProductCategoryRelation])
  // categories: Relation<ProductCategoryRelation[]>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [ProductVariantResponse])
  ProductVariant: ProductVariantResponse[];
}

export enum ProductSortEnum {
  PRICE_LOW_TO_HIGH = "price_low_to_high",
  PRICE_HIGH_TO_LOW = "price_high_to_low",
  NEWEST = "newest",
}
registerEnumType(ProductSortEnum, {
  name: "ProductSortEnum",
});

@ObjectType()
export class GetAllProductsResponse {
  @Field(() => [ProductResponse])
  data?: ProductResponse[];

  @Field()
  total?: number;

  @Field()
  currentPage?: number;

  @Field()
  totalPages?: number;

  @Field()
  hasMore?: boolean;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class GetFeaturedProductsResponse {
  @Field(() => [ProductResponse])
  data?: ProductResponse[];

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class GetProductBySlugResponse {
  @Field({ nullable: true })
  data?: ProductResponse;

  @Field({ nullable: true })
  error?: string;
}
