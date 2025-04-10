import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Length } from "class-validator";
import { ProductVariant } from "./ProductVariant.js";
import { Product } from "./Product.js";
import { ProductCategory } from "./ProductCategory.js";
@Entity()
@ObjectType()
export class ProductCategoryRelation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.categories, {
    onDelete: "SET NULL",
  })
  @Field(() => Product)
  product: Relation<Product>;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: "CASCADE",
  })
  @Field(() => ProductCategory)
  category: Relation<ProductCategory>;
}
