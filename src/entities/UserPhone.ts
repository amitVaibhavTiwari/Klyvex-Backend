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
export class UserPhone {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({
    type: "varchar",
    length: 15,
    nullable: true,
  })
  phone: string;

  @Field()
  @Column()
  isVerified: boolean;

  @Field(() => AccountUser)
  @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserPhone, {
    //   this means if parent record is deleted, delete all child records with foreign key.
    onDelete: "CASCADE",
  })
  AccountUser: Relation<AccountUser>;

  @Field()
  @Column({ nullable: true })
  lastOtpSent: string;

  @Field()
  @Column({ type: "timestamp", nullable: true })
  lastOtpSentTime: Date;

  @Field()
  @Column({ type: "timestamp", nullable: true })
  otpExpiry: Date;

  @Field()
  @Column({
    type: "varchar",
    nullable: true,
  })
  retryCount: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
