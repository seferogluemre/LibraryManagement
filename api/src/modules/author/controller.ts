import Elysia from "elysia";
import {
  authorCreateDto,
  authorDestroyDto,
  authorIndexDto,
  authorShowDto,
  authorUpdateDto,
} from "./dtos";
import { AuthorFormatter } from "./formatters";
import { AuthorService } from "./service";

export const app = new Elysia({
  prefix: "/authors",
  name: "Author",
  detail: {
    tags: ["authors"],
  },
})
  .post(
    "",
    async ({ body }) => {
      const author = await AuthorService.store(body);
      return AuthorFormatter.response(author);
    },
    authorCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const authors = await AuthorService.index(query);
      return authors;
    },
    authorIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const author = await AuthorService.show({ id });
      return author;
    },
    authorShowDto
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const updatedAuthor = await AuthorService.update(id, body);
      return AuthorFormatter.response(updatedAuthor);
    },
    authorUpdateDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await AuthorService.destroy(id);
      return { message: "Yazar başarıyla silindi" };
    },
    authorDestroyDto
  );
