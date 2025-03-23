import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import {
  bookRepository,
  librarianRepository,
  loanRepository,
  studentRepository,
} from "../repositories/repositories.js";
import { Books, Genre } from "../entities/Books.js";
import { validate } from "class-validator";
import { Loans } from "../entities/Loans.js";

// response types
@ObjectType()
export class loanResponse {
  @Field(() => Loans, { nullable: true })
  loan?: Loans;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
class getSingleLoanResponse {
  @Field(() => Loans, { nullable: true })
  loan?: Loans;

  @Field({ nullable: true })
  error?: string;
}

//
// resolvers
@Resolver(Loans)
export class loanResolver {

  @Query(() => getSingleLoanResponse, { nullable: true })
  async getSingleLoan(
    @Arg("id", () => String) id: string
  ): Promise<getSingleLoanResponse> {
    try {
      const loan = await loanRepository.findOne({
        where: { id },
        relations: ["student", "librarian", "book"], //  Ensures that all these related entities are also loaded (sirf agar tum loan managaoge, (find one by ID krke) toh jab frontend se query chalegi aur usme kisi ne book ya student ya librarian ka kuch data mangwa liya toh wo phat jaayega. Data poora jitna bhi loan se related ho wo poora la ke graphql ko de do. iske baad graphql khud manage kr lega kitna data bhejne ka h)
      });
      if (!loan) {
        throw new Error("No Book Found.");
      }
      return { loan: loan };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }

  // Add a new book
  // this below line tells what will be returned by my mutation. It basically returns bookResponse.
  @Mutation(() => loanResponse)
  async addLoan(
    @Arg("isActive") isActive: boolean,
    @Arg("bookId") bookId: string,
    @Arg("librarianId") librarianId: number,
    @Arg("studentId") studentId: number
  ): Promise<loanResponse> {
    try {
      const book = await bookRepository.findOneBy({ id: bookId });
      if (!book) {
        throw new Error("Book not found for the given bookId.");
      }
      if (book.available == false) {
        throw new Error("Selected Book is already borrowed.");
      }

      const student = await studentRepository.findOneBy({
        id: studentId,
      });
      if (!student) {
        throw new Error("Student not found for the given studentId.");
      }
      const librarian = await librarianRepository.findOneBy({
        id: librarianId,
      });
      if (!librarian) {
        throw new Error("Librarian not found for the given librarianId.");
      }

      console.log("amit");

      const loan = new Loans();
      const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      loan.dueDate = new Date(dueDate);
      loan.student = student;
      loan.book = book;
      loan.isActive = isActive;
      loan.librarian = librarian;

      const newLoan = await loanRepository.save(loan);

      if (newLoan) {
        book.available = false;
        bookRepository.save(book);
      }

      return { loan: newLoan };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
}
