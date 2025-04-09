import {
  Entity,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Length } from "class-validator";
import { ProductVariant } from "./ProductVariant.js";
import { Product } from "./Product.js";
import { ProductCategory } from "./ProductCategory.js";
@Entity()
@ObjectType()
export class ProductCategoryRelation {
  //   @PrimaryGeneratedColumn("uuid")
  //   @Field(() => String)
  //   id: string;

  @ManyToOne(() => Product, (product) => product.relations, {
    onDelete: "SET NULL",
  })
  @Field(() => Product)
  product: Product;

  @ManyToOne(() => ProductCategory, (category) => category.relations, {
    onDelete: "CASCADE",
  })
  @Field(() => ProductCategory)
  category: ProductCategory;
}
