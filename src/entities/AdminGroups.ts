import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { type Relation } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { AdminPermissions } from "./AdminPermissions.js";
import { AdminUser } from "./AdminUser.js";

@ObjectType()
@Entity()
export class AdminGroups {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column({ default: true })
  isActive: boolean;

  @Field(() => [AdminUser])
  @OneToMany(() => AdminUser, (AdminUser) => AdminUser.AdminGroups)
  AdminUser: Relation<AdminUser[]>;

  @Field(() => Permissions)
  @ManyToMany(
    () => AdminPermissions,
    (AdminPermissions) => AdminPermissions.adminGroups,
    {
      cascade: true,
    }
  )
  @JoinTable({
    name: "admin_group_permissions", //  name of the join table
    joinColumn: {
      name: "group_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  Permissions: AdminPermissions[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
