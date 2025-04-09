import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { type Relation } from "typeorm";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";

@ObjectType()
@Entity()
export class ProductImage {
  @Field(() => Product)
  @ManyToOne(() => Product, (Product) => Product.ProductVariant, {
    onDelete: "CASCADE",
  })
  Product: Relation<Product>;

  @Field(() => ProductVariant)
  @ManyToOne(
    () => ProductVariant,
    (ProductVariant) => ProductVariant.ProductImage,
    {
      onDelete: "CASCADE",
    }
  )
  ProductVariant: Relation<ProductVariant>;

  @Field()
  @Column()
  imageUrl: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    nullable: true,
  })
  rank: string;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  metaData: object;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
