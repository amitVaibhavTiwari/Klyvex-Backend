import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { type Relation } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AdminGroups } from "./AdminGroups.js";

@ObjectType()
@Entity()
export class AdminPermissions {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  permission: string;

  @Field(() => AdminGroups)
  @ManyToMany(() => AdminGroups, (adminGroup) => adminGroup.Permissions)
  adminGroups: AdminGroups[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
