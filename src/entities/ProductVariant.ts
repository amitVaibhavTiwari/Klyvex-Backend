import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Length } from "class-validator";
import { Product } from "./Product.js";
import { ProductImage } from "./ProductImage.js";
import { WarehouseStock } from "./WarehouseStock.js";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class ProductVariant {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("uuid")
  productId: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (Product) => Product.ProductVariant, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productId" })
  Product: Relation<Product>;

  @Field()
  @Column({ default: false })
  isDefault: boolean;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  price: object;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  tax: object;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Length(1, 2000)
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  size: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  height: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  width: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  length: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  weight: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  color: string;

  @Field()
  @Column({ default: false })
  allowBackorder: boolean;

  @Field(() => [ProductImage])
  @OneToMany(() => ProductImage, (ProductImage) => ProductImage.ProductVariant)
  ProductImage: Relation<ProductImage[]>;

  @Field(() => [WarehouseStock])
  @OneToMany(
    () => WarehouseStock,
    (WarehouseStock) => WarehouseStock.ProductVariant
  )
  WarehouseStock: Relation<WarehouseStock[]>;

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
