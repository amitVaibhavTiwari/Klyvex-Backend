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
import { ProductVariant } from "./ProductVariant.js";
import { ProductCategoryRelation } from "./ProductCategoryRelation.js";
import { GraphQLJSON } from "graphql-type-json";
import { ProductType } from "./ProductType.js";

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
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ nullable: true })
  thumbnail: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column()
  @Length(1, 200)
  slug: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  attributes: object;

  @Field()
  @Column()
  productTypeId: number;

  @Field(() => ProductType)
  @ManyToOne(() => ProductType, (ProductType) => ProductType.products, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "productTypeId" })
  productType: Relation<ProductType>;

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
