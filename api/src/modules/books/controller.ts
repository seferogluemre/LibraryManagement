import Elysia from "elysia";
import {
  bookByIsbnDto,
  bookCreateDto,
  bookDestroyDto,
  bookIndexDto,
  bookShowDto,
  bookUpdateDto,
  booksByAuthorDto,
  booksByCategoryDto,
  booksByPublisherDto,
} from "./dtos";
import { BookFormatter } from "./formatters";
import { BookService } from "./service";

export const app = new Elysia({
  prefix: "/books",
  name: "Book",
  detail: {
    tags: ["Books"],
  },
})
  .post(
    "",
    async ({ body, headers }) => {
      const book = await BookService.store(body, headers.authorization);
      return BookFormatter.response(book);
    },
    bookCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const books = await BookService.index(query);
      return books.map(BookFormatter.response);
    },
    bookIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const book = await BookService.show({ id });
      return BookFormatter.response(book);
    },
    bookShowDto
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const updatedBook = await BookService.update(id, body);
      return BookFormatter.response(updatedBook);
    },
    bookUpdateDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await BookService.destroy(id);
      return { message: "Kitap başarıyla silindi" };
    },
    bookDestroyDto
  )
  .get(
    "/author/:authorId",
    async ({ params: { authorId } }) => {
      const books = await BookService.getBooksByAuthor(authorId);
      return books.map(BookFormatter.response);
    },
    booksByAuthorDto
  )
  .get(
    "/category/:categoryId",
    async ({ params: { categoryId } }) => {
      const books = await BookService.getBooksByCategory(categoryId);
      return books.map(BookFormatter.response);
    },
    booksByCategoryDto
  )
  .get(
    "/publisher/:publisherId",
    async ({ params: { publisherId } }) => {
      const books = await BookService.getBooksByPublisher(publisherId);
      return books.map(BookFormatter.response);
    },
    booksByPublisherDto
  )
  .get(
    "/isbn/:isbn",
    async ({ params: { isbn } }) => {
      const book = await BookService.findByIsbn(isbn);
      if (!book) {
        throw new Error("Kitap bulunamadı");
      }
      return BookFormatter.response(book);
    },
    bookByIsbnDto
  );
