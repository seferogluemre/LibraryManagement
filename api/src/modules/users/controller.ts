import { Elysia } from "elysia";

import { CacheService } from "../../core/cache.service";
import {
  onlineUserResponseDto,
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
    "",
    async ({ query }) => {
      const users = await UsersService.index(query);
      return users.map(UserFormatter.response);
    },
    userIndexDto
  )
  .get(
    "/online-users",
    async () => {
      return CacheService.getAllOnlineUsers();
    },
    onlineUserResponseDto,
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
    "/:id",
    async ({ params: { id } }) => {
      await UsersService.destroy(id);
      return { message: "Kullanıcı başarıyla silindi" };
    },
    userDestroyDto
  );
