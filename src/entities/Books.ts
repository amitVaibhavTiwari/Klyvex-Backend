import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Check,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID, registerEnumType } from "type-graphql";
import { Loans } from "./Loans.js";
import { type Relation } from "typeorm";
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  isBoolean,
  isNumber,
  IsNumber,
  IsBoolean,
  IsEnum,
} from "class-validator";

export enum Genre {
  FICTION = "Fiction",
  NON_FICTION = "Non-Fiction",
  SCIENCE = "Science",
  FANTASY = "Fantasy",
}

// Register the Genre enum for GraphQL
registerEnumType(Genre, {
  name: "Genre", // GraphQL enum name
});

// for graphql (below one)
@ObjectType()
// to define an entity in typeORM (below one)
@Entity()
export class Books {
  // field is for graphQl
  @Field(() => ID)
  // below one is for typeORM
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  // below one is for typeORM
  @Column()
  // validation
  @Length(10, 50)
  // name of column in DB
  title: string;

  @Field()
  @Column()
  @Length(10, 50)
  author: string;

  @Field(() => Genre)
  @IsEnum(Genre, {
    message:
      "Invalid genre. Must be one of FICTION, NON_FICTION, SCIENCE, FANTASY",
  })
  @Column({
    type: "enum",
    enum: Genre,
  })
  genre: Genre;

  @Field()
  @Column()
  @IsBoolean({ message: "Available must be a boolean" })
  available: boolean;

  @Field()
  @Column("float")
  @IsNumber({}, { message: "Price must be a number" })
  @Min(0, { message: "Price must be at least 0" })
  @Max(10000, { message: "Price cannot exceed 10000" })
  price: number;

  // (this column points to many records in a different table)
  // isko ye Relation wale generic me dala gaya h to fix circular dependency issue.

  @Field(() => [Loans])
  @OneToMany(() => Loans, (loan) => loan.book)
  loan: Relation<Loans[]>;
}
