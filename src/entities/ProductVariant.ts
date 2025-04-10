import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { Length } from "class-validator";
import { Product } from "./Product.js";
import { ProductImage } from "./ProductImage.js";
import { WarehouseStock } from "./WarehouseStock.js";

@ObjectType()
@Entity()
export class ProductVariant {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Product)
  @ManyToOne(() => Product, (Product) => Product.ProductVariant, {
    onDelete: "CASCADE",
  })
  Product: Relation<Product>;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  price: object;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
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
  ProductImage: Relation<ProductVariant[]>;

  @Field(() => [WarehouseStock])
  @OneToMany(
    () => WarehouseStock,
    (WarehouseStock) => WarehouseStock.ProductVariant
  )
  WarehouseStock: Relation<WarehouseStock[]>;

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
