import { Classroom } from "@prisma/client";
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
  prefix: "classrooms",
  name: "Classroom",
  detail: {
    tags: ["Classrooms"],
  },
})
  .post(
    "",
    async ({ body }) => {
      const classroom = await ClassroomService.store(body);
      return ClassroomFormatter.response(classroom);
    },
    classroomCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const classrooms = await ClassroomService.index(query);
      return classrooms;
    },
    classroomIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const targetClassroom = await ClassroomService.show({ id });
      return ClassroomFormatter.response(
        targetClassroom as unknown as Classroom
      );
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
    classroomUpdateDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await ClassroomService.destroy(id);
      return { message: "Sınıf başarıyla silindi" };
    },
    classroomDestroyDto
  );
