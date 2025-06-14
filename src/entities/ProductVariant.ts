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

  @Field()
  @Column()
  sku: string;

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

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  attributes: object;

  @Field(() => [ProductImage])
  @OneToMany(() => ProductImage, (ProductImage) => ProductImage.ProductVariant)
  ProductImage: Relation<ProductImage[]>;

  @Field(() => [WarehouseStock])
  @OneToMany(
    () => WarehouseStock,
    (WarehouseStock) => WarehouseStock.ProductVariant
  )
  WarehouseStock: Relation<WarehouseStock[]>;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
