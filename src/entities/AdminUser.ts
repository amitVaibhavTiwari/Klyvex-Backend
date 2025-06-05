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
import { IsEmail, Length } from "class-validator";
import { AdminGroups } from "./AdminGroups.js";

@ObjectType()
@Entity()
export class AdminUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @Length(1, 60)
  name: string;

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

  @Field()
  @Column("uuid", { unique: true, default: () => "uuid_generate_v4()" }) //to Auto-generate in PostgreSQL
  tokenId: string;

  @Field()
  @Column({ type: "int" })
  adminGroupsId: number;

  @Field(() => AdminGroups)
  @ManyToOne(() => AdminGroups, (AdminGroups) => AdminGroups.AdminUser, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "adminGroupsId" })
  AdminGroups: Relation<AdminGroups>;

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
