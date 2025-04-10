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
import { Length } from "class-validator";
import { ProductVariant } from "./ProductVariant.js";
import { ProductCategoryRelation } from "./ProductCategoryRelation.js";

@ObjectType()
@Entity()
export class Product {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  @Length(1, 250)
  name: string;

  @Field()
  @Column()
  @Length(10, 2000)
  description: string;

  @Field()
  @Column()
  @Length(1, 200)
  slug: string;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  metaData: object;

  //   for product and category relation inside ProductCategoryRelation Entity
  @OneToMany(() => ProductCategoryRelation, (relation) => relation.product)
  @Field(() => [ProductCategoryRelation])
  categories: Relation<ProductCategoryRelation[]>;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Field(() => [ProductVariant])
  @OneToMany(() => ProductVariant, (ProductVariant) => ProductVariant.Product)
  ProductVariant: Relation<ProductVariant[]>;
}
