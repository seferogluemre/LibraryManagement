import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { authController } from "@modules/auth";
import { userController } from "@modules/users";
import { Elysia } from "elysia";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .use(userController)
  .use(authController)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
