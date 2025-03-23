import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { type Relation } from "typeorm";
import { Books } from "./Books.js";
import { Librarians } from "./librarians.js";
import { Students } from "./students.js";


@ObjectType()
@Entity()
export class Loans {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  isActive: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date; // Automatically set when the record is created

  @Field()
  @Column({ type: "date", nullable: true })
  returnDate: Date;

  @Field()
  @Column({ type: "date", nullable: false })
  dueDate: Date;

  //  (many records from this table can point to one particular record's column in different table)
  // isko ye Relation wale generic me dala gaya h to fix circular dependency issue.
  @Field(() => Books)
  @ManyToOne(
    () => Books,
    (book) => book.loan,
    //   this means if parent record is deleted, set Null in all the child records with foreign key.
    { onDelete: "SET NULL" }
  )
  book: Relation<Books>;

  @Field(() => Librarians)
  @ManyToOne(() => Librarians, (librarian) => librarian.loan, {
    //   this means if parent record is deleted, set Null in all the child records with foreign key.
    onDelete: "SET NULL",
  })
  librarian: Relation<Librarians>;

  @Field(() => Students)
  @ManyToOne(() => Students, (students) => students.loan, {
    //   this means if parent record is deleted, delete all child records with foreign key.
    onDelete: "CASCADE",
  })
  student: Relation<Students>;
}
