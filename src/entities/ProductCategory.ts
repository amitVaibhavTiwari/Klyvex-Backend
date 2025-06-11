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
import { ProductCategoryRelation } from "./ProductCategoryRelation.js";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class ProductCategory {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

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

  @Field({ nullable: true })
  @Column({ type: Number, nullable: true })
  rank: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  metaData: object;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field()
  @Column({ type: "int", nullable: true })
  parentCategoryId: number;

  //   for relation of product and category inside productCategoryRelation Entity
  @OneToMany(() => ProductCategoryRelation, (relation) => relation.category)
  @Field(() => [ProductCategoryRelation])
  products: Relation<ProductCategoryRelation[]>;

  @Field({ nullable: true })
  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  // Self-referencing relation for nested categories (e.g., parent -> child)
  @Field(() => ProductCategory, { nullable: true })
  @ManyToOne(() => ProductCategory, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: "parentCategoryId" })
  parentCategory?: Relation<ProductCategory>;

  @Field(() => [ProductCategory], { nullable: true })
  @OneToMany(() => ProductCategory, (category) => category.parentCategory)
  children?: Relation<ProductCategory[]>;
}
