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
import { IsEmail, Length } from "class-validator";

@ObjectType()
@Entity()
export class UserEmail {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field()
  @Column()
  @Length(6, 20)
  password: string;

  @Field()
  @Column({ default: false })
  isVerified: boolean;

  @Field()
  @Column("uuid")
  accountUserId: string;

  @Field(() => AccountUser)
  @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserEmail, {
    //   this means if parent record is deleted, delete all child records with foreign key.
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "accountUserId" })
  AccountUser: Relation<AccountUser>;

  @Field(() => String, { nullable: true })
  @Column({ type: "text", nullable: true })
  lastOtpSent: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  lastOtpSentTime: Date | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", nullable: true })
  otpExpiry: Date | null;

  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    nullable: true,
  })
  retryCount: string | null;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
