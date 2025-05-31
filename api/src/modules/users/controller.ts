import { Elysia } from "elysia";

import {
  userCreateDto,
  userDestroyDto,
  userIndexDto,
  userShowDto,
  userUpdateDto,
} from "./dtos";
import { UserFormatter } from "./formatters";
import { UsersService } from "./service";

export const app = new Elysia({
  prefix: "/users",
  detail: {
    tags: ["Users"],
  },
})
  .post(
    "",
    async ({ body }) => {
      const user = await UsersService.store(body);
      return UserFormatter.response(user);
    },
    userCreateDto
  )
  .get(
    "", // Kullanıcıları listeleme
    async ({ query }) => {
      const users = await UsersService.index(query);
      return users.map(UserFormatter.response);
    },
    userIndexDto
  )
  .get(
    "/:id", // Tek kullanıcı gösterme
    async ({ params: { id } }) => {
      const targetUser = await UsersService.show({ id });
      return UserFormatter.response(targetUser);
    },
    userShowDto
  )
  .patch(
    "/:id", // Kullanıcı güncelleme
    async ({ params: { id }, body }) => {
      const updatedUser = await UsersService.update(id, body);
      return UserFormatter.response(updatedUser);
    },
    userUpdateDto
  )
  .delete(
    "/:id", // Kullanıcı silme
    async ({ params: { id } }) => {
      await UsersService.destroy(id);
      return { message: "Kullanıcı başarıyla silindi" };
    },
    userDestroyDto
  );
