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
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class Warehouse {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => GraphQLJSON, { nullable: false })
  @Column("jsonb", { nullable: false })
  address: object;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  code: string;

  @Field()
  @Column({ default: false })
  isActive: boolean;

  @Field(() => [WarehouseStock])
  @OneToMany(() => WarehouseStock, (WarehouseStock) => WarehouseStock.Warehouse)
  Stock: Relation<WarehouseStock[]>;

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
