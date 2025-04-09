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
import { ProductCategoryRelation } from "./CategoryProductRelation.js";

@ObjectType()
@Entity()
export class ProductCategory {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  @Length(1, 250)
  name: string;

  @Field()
  @Column()
  @Length(1, 250)
  slug: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Length(1, 2000)
  description: string;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  metaData: object;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  //   for relation of product and category inside productCateGoryRelation Entity
  @OneToMany(() => ProductCategoryRelation, (relation) => relation.category)
  @Field(() => [ProductCategoryRelation])
  relations: ProductCategoryRelation[];

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  //   this below one is for, let's say someone wants to create a category inside a category. ex: categories->shoes->running,sports
  @Field(() => [ProductCategory], { nullable: true })
  @OneToMany(() => ProductCategory, (ProductCategory) => ProductCategory.id, {
    nullable: true,
  })
  parentCategoryId: Relation<ProductCategory[]>;
}
