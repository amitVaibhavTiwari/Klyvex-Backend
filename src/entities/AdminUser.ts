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
import { IsEmail, Length } from "class-validator";

@ObjectType()
@Entity()
export class AdminUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Length(6, 20)
  password: string;

  @Field()
  @Column({ default: false })
  isVerified: boolean;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  //   @Field(() => AccountUser)
  //   @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserEmail, {
  //     //   this means if parent record is deleted, delete all child records with foreign key.
  //     onDelete: "CASCADE",
  //   })
  //   AccountUser: Relation<AccountUser>;

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
