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
import { ProductVariant } from "./ProductVariant.js";
import { Warehouse } from "./Warehouse.js";

@ObjectType()
@Entity()
export class WarehouseStock {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => ProductVariant)
  @ManyToOne(
    () => ProductVariant,
    (ProductVariant) => ProductVariant.WarehouseStock,
    {
      onDelete: "CASCADE",
    }
  )
  ProductVariant: Relation<ProductVariant>;

  @Field(() => Warehouse)
  @ManyToOne(() => Warehouse, (Warehouse) => Warehouse.Stock, {
    onDelete: "CASCADE",
  })
  Warehouse: Relation<Warehouse>;

  @Field()
  @Column({ default: 0 })
  stockQuantity: number;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field()
  @Column({ default: 0 })
  reservedQuantity: string;

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
