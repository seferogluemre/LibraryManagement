import { Elysia } from "elysia";
import {
  categoryCreateDto,
  categoryDestroyDto,
  categoryIndexDto,
  categoryShowDto,
  categoryUpdateDto,
} from "./dtos";
import { CategoryFormatter } from "./formatters";
import { CategoryService } from "./service";

export const app = new Elysia({
  prefix: "/categories",
  tags: ["Categories"],
})
  .post(
    "",
    async ({ body }) => {
      const category = await CategoryService.store(body);
      return CategoryFormatter.response(category);
    },
    categoryCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const categories = await CategoryService.index(query);
      return categories;
    },
    categoryIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const category = await CategoryService.show({ id });
      return category;
    },
    categoryShowDto
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const category = await CategoryService.update(id, body);
      return CategoryFormatter.response(category);
    },
    categoryUpdateDto
  )
  .delete(
    "/:id",
    async ({ params , body }) => {
      await CategoryService.destroy(body.params.id);
      return { message: "Kategori başarıyla silindi" };
    },
    {
      ...categoryDestroyDto,
    }
  );

export default app;
