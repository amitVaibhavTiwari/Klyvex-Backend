import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { type Relation } from "typeorm";
import { UserEmail } from "./UserEmail.js";
import { UserPhone } from "./UserPhone.js";
import { UserAddress } from "./UserAddress.js";
import { Length } from "class-validator";

@ObjectType()
@Entity()
export class AccountUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("uuid", { unique: true, default: () => "uuid_generate_v4()" }) //to Auto-generate in PostgreSQL
  tokenId: string;

  @Field()
  @Column()
  @Length(1, 60)
  name: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String) // GraphQL does not support JSON directly, so using String
  @Column("jsonb", { nullable: true }) // Correctly define as JSONB in TypeORM
  metaData: object;

  @Field(() => [UserEmail])
  @OneToMany(() => UserEmail, (UserEmail) => UserEmail.AccountUser)
  UserEmail: Relation<UserEmail[]>;

  @Field(() => [UserPhone])
  @OneToMany(() => UserPhone, (UserPhone) => UserPhone.AccountUser)
  UserPhone: Relation<UserEmail[]>;

  @Field(() => [UserAddress])
  @OneToMany(() => UserAddress, (UserAddress) => UserAddress.AccountUser)
  UserAddress: Relation<UserEmail[]>;
}
