import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Product } from "./Product.js";
import { ProductVariant } from "./ProductVariant.js";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class ProductImage {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("uuid")
  productId: string;

  @Field()
  @Column("uuid")
  productVariantId: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (Product) => Product.ProductVariant, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  Product: Relation<Product>;

  @Field(() => ProductVariant)
  @ManyToOne(
    () => ProductVariant,
    (ProductVariant) => ProductVariant.ProductImage,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "productVariantId" })
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

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  metaData: object;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
