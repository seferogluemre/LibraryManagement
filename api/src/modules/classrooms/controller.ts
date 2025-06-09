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
  .derive(async ({ headers }) => {
    try {
      const user = await authGuard(headers);
      return { user, isAuthenticated: true };
    } catch (error) {
      return { user: null, isAuthenticated: false };
    }
  })
  .post(
    "",
    async ({ body, user }) => {
      const classroom = await ClassroomService.store(body, user!.id);
      return ClassroomFormatter.response(classroom);
    },
    {
      ...classroomCreateDto,
      beforeHandle: ({ isAuthenticated, set }) => {
        if (!isAuthenticated) {
          set.status = 401;
          return "Unauthorized";
        }
      },
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
      beforeHandle: ({ isAuthenticated, set }) => {
        if (!isAuthenticated) {
          set.status = 401;
          return "Unauthorized";
        }
      },
    }
  )
  .delete(
    "/:id",
    async ({ params,body }) => {
      await ClassroomService.destroy(body.params.id);
      return { message: "Sınıf başarıyla silindi" };
    },
    {
      ...classroomDestroyDto,
    }
  );
