import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { ProductVariant } from "./ProductVariant.js";
import { Warehouse } from "./Warehouse.js";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class WarehouseStock {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("uuid")
  productVariantId: string;

  @Field()
  @Column("int")
  warehouseId: number;

  @Field(() => ProductVariant)
  @ManyToOne(
    () => ProductVariant,
    (ProductVariant) => ProductVariant.WarehouseStock,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinColumn({ name: "productVariantId" })
  ProductVariant: Relation<ProductVariant>;

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, (Warehouse) => Warehouse.Stock, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "warehouseId" })
  Warehouse: Relation<Warehouse>;

  @Field()
  @Column({ default: 0 })
  stockQuantity: number;

  @Field()
  @Column({ default: false })
  allowBackorder: boolean;

  @Field()
  @Column({ default: 0 })
  reservedQuantity: string;

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
