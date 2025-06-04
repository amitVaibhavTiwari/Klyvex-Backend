import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Product } from "./Product.js";
import { ProductCategory } from "./ProductCategory.js";
@Entity()
@ObjectType()
export class ProductCategoryRelation {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("uuid")
  productId: string;

  @Field()
  @Column("int")
  categoryId: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.categories, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "productId" })
  product: Relation<Product>;

  @Field(() => ProductCategory)
  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "categoryId" })
  category: Relation<ProductCategory>;
}
