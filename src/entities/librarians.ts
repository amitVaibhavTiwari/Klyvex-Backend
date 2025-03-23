import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { type Relation } from "typeorm";
import { Loans } from "./Loans.js";

@ObjectType()
@Entity()
export class Librarians {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({
    type: "varchar",
    length: 15,
    nullable: true,
  })
  mobile: string;

  // (this column points to many records in a different table)
  // isko ye Relation wale generic me dala gaya h to fix circular dependency issue.
  @Field(() => [Loans])
  @OneToMany(() => Loans, (loan) => loan.librarian)
  loan: Relation<Loans[]>;
}
