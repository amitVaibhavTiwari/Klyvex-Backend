// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
// } from "typeorm";
// import { type Relation } from "typeorm";
// import { ObjectType, Field, ID } from "type-graphql";

// @ObjectType()
// @Entity()
// export class AdminPermissionRelation {
//   @Field(() => ID)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field()
//   @Column({ unique: true })
//   permission: string;

//   //   @Field(() => AccountUser)
//   //   @ManyToOne(() => AccountUser, (AccountUser) => AccountUser.UserEmail, {
//   //     //   this means if parent record is deleted, delete all child records with foreign key.
//   //     onDelete: "CASCADE",
//   //   })
//   //   AccountUser: Relation<AccountUser>;

//   @Field()
//   @CreateDateColumn({ type: "timestamp" })
//   createdAt: Date;

//   @Field()
//   @UpdateDateColumn({ type: "timestamp" })
//   updatedAt: Date;
// }
