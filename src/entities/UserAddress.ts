import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { type Relation } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AccountUser } from "./AccountUser.js";

@ObjectType()
@Entity()
export class UserAddress {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { nullable: true }) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  address: object;

  @Field(() => AccountUser)
  @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserAddress, {
    //   this means if parent record is deleted, delete all child records with foreign key.
    onDelete: "CASCADE",
  })
  AccountUser: Relation<AccountUser>;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
