import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
} from "type-graphql";
import { bookRepository } from "../repositories/repositories.js";
import { Books, Genre } from "../entities/Books.js";
import { validate } from "class-validator";

// response types
@ObjectType()
export class BookResponse {
  @Field(() => Books, { nullable: true })
  book?: Books;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
class DeleteBookResponse {
  @Field({ nullable: true })
  success?: boolean;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
class GetBooksResponse {
  @Field(() => [Books], { nullable: true })
  books: Books[] | null;
}

//
// resolvers
@Resolver(Books)
export class BookResolver {
  // Get all books
  @Query(() => GetBooksResponse)
  async getAllBooks(
    @Arg("limit", () => Number, { nullable: true }) limit?: number,
    @Arg("offset", () => Number, { nullable: true }) offset?: number,
    @Arg("genre", { nullable: true }) genre?: string
  ): Promise<GetBooksResponse> {
    try {
      const query = bookRepository.createQueryBuilder("book");
      if (genre) {
        query.where("book.genre = :genre", { genre });
      }

      if (limit) query.take(limit);
      if (offset) query.skip(offset);

      const books = await query.getMany();
      return { books: books };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Internal Server Error";
      console.log(msg);
      return { books: null };
    }
  }

  @Query(() => Books, { nullable: true })
  async getSingleBook(
    @Arg("id", () => String) id: string
  ): Promise<Books | null> {
    return (await bookRepository.findOneBy({ id })) || null;
  }

  // Add a new book
  // this below line tells what will be returned by my mutation. It basically returns bookResponse.
  @Mutation(() => BookResponse)
  async addBook(
    @Arg("title") title: string,
    @Arg("author") author: string,
    @Arg("genre", () => Genre) genre: Genre,
    @Arg("price") price: number,
    @Arg("available") available: boolean
  ): Promise<BookResponse> {
    try {
      const book = new Books();
      book.title = title;
      book.author = author;
      book.genre = genre;
      book.price = price;
      book.available = available;

      // Validate input using class-validator
      const errors = await validate(book);
      if (errors.length > 0) {
        throw new Error(
          errors.map((e) => Object.values(e.constraints || {})).join(", ")
        );
      }
      const newBok = await bookRepository.save(book);

      return { book: newBok };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Internal Server Error.",
      };
    }
  }
  // Delete a book
  @Mutation(() => DeleteBookResponse)
  async deleteBook(@Arg("id") id: string): Promise<DeleteBookResponse> {
    try {
      const book = await bookRepository.findOneBy({ id });
      if (!book) {
        return { success: false, message: "Book not found" };
      }
      const result = await bookRepository.delete(id);
      if (result.affected === 0) {
        return { success: false, message: "Failed to delete the book" };
      }
      return { success: true, message: "Book deleted successfully" };
    } catch (error) {
      console.error("Error deleting book:", error);
      return { success: false, message: "Internal server error" };
    }
  }
}
