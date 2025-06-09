import { Classroom } from "@prisma/client";
import { authGuard } from "@utils/auth-middleware";
import Elysia from "elysia";
import {
  classroomCreateDto,
  classroomDestroyDto,
  classroomIndexDto,
  classroomShowDto,
  classroomUpdateDto,
} from "./dtos";
import { ClassroomFormatter } from "./formatters";
import { ClassroomService } from "./service";

export const app = new Elysia({
  prefix: "/classrooms",
  name: "Classroom",
  detail: {
    tags: ["Classrooms"],
  },
})
  .derive(async (context) => {
    const authContext = {
      user: null as any,
      isAuthenticated: false,
    };
    try {
      const user = await authGuard(context.headers);
      authContext.user = user;
      authContext.isAuthenticated = true;
    } catch (error) {
    }
    return authContext;
  })
  .post(
    "",
    async ({ body, user }) => {
      const classroom = await ClassroomService.store(body, user.id);
      return ClassroomFormatter.response(classroom);
    },
    {
      ...classroomCreateDto,
      beforeHandle: [
        ({ isAuthenticated }) => {
          if (!isAuthenticated) {
            throw new Error("Unauthorized");
          }
        },
      ],
    }
  )
  .get(
    "",
    async ({ query }) => {
      const classrooms = await ClassroomService.index(query);
      return ClassroomFormatter.listResponseWithStudents(classrooms);
    },
    classroomIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const targetClassroom = await ClassroomService.show({ id });
      return ClassroomFormatter.responseWithStudents(targetClassroom);
    },
    classroomShowDto
  )
  .patch(
    "/:id",
    async ({ params: { id }, body }) => {
      const updatedClassroom = await ClassroomService.update(id, body);
      return ClassroomFormatter.response(
        updatedClassroom as unknown as Classroom
      );
    },
    {
      ...classroomUpdateDto,
      beforeHandle: [
        ({ isAuthenticated }) => {
          if (!isAuthenticated) {
            throw new Error("Unauthorized");
          }
        },
      ],
    }
  )
  .delete(
    "/:id",
    async ({  body }) => {
        await ClassroomService.destroy(body.params.id);
      return { message: "Sınıf başarıyla silindi" };
    },
    {
      ...classroomDestroyDto,
    }
  );
