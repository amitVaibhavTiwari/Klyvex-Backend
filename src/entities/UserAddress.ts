import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { type Relation } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AccountUser } from "./AccountUser.js";
import { GraphQLJSON } from "graphql-type-json";

@ObjectType()
@Entity()
export class UserAddress {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column("jsonb", { nullable: true })
  address: object;

  @Field()
  @Column("uuid")
  accountUserId: string;

  @Field(() => AccountUser)
  @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserAddress, {
    //   this means if parent record is deleted, delete all child records with foreign key.
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "accountUserId" })
  AccountUser: Relation<AccountUser>;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
