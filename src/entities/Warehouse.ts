import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { WarehouseStock } from "./WarehouseStock.js";

@ObjectType()
@Entity()
export class Warehouse {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: false }) // Correctly define as JSONB in TypeORM
  address: object;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  code: string;

  @Field(() => [WarehouseStock])
  @OneToMany(() => WarehouseStock, (WarehouseStock) => WarehouseStock.Warehouse)
  Stock: Relation<WarehouseStock[]>;

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
