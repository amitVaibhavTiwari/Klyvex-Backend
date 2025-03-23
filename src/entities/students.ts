import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { type Relation } from "typeorm";
import { Loans } from "./Loans.js";
// import { Loans } from "./Loans.js";

@ObjectType()
@Entity()
export class Students {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
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

  @Field()
  @Column()
  course: string;

  //   // (this column points to many records in a different table)
  @Field(() => [Loans])
  @OneToMany(() => Loans, (loan) => loan.student)
  // isko ye Relation wale generic me dala gaya h to fix circular dependency issue.
  loan: Relation<Loans[]>;
}
