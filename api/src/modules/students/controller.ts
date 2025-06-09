import Elysia from "elysia";
import {
  studentByClassDto,
  studentByStudentNoDto,
  studentCreateDto,
  studentDestroyDto,
  studentIndexDto,
  studentShowDto,
  studentUpdateDto,
} from "./dtos";
import { StudentFormatter } from "./formatters";
import { StudentService } from "./service";

export const app = new Elysia({
  prefix: "/students",
  name: "Student",
  detail: {
    tags: ["Students"],
  },
})
  .post(
    "",
    async ({ body }) => {
      const student = await StudentService.store(body);
      return StudentFormatter.response(student);
    },
    studentCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const students = await StudentService.index(query);
      return StudentFormatter.listResponse(students);
    },
    studentIndexDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const targetStudent = await StudentService.show({ id });
      return StudentFormatter.response(targetStudent);
    },
    studentShowDto
  )
  .patch(
    "/:id",
    async ({  body , params}) => {
      const updatedStudent = await StudentService.update(params.id, body);
      return StudentFormatter.response(updatedStudent);
    },
    studentUpdateDto
  )
  .delete(
    "/:id",
    async ({ body }) => {
      const student = await StudentService.destroy(body);
      return { message: "Öğrenci başarıyla silindi" };
    },
    studentDestroyDto
  )
  .get(
    "/by-class/:classId",
    async ({ params: { classId } }) => {
      const students = await StudentService.getStudentsByClass(classId);
      return StudentFormatter.listResponse(students);
    },
    studentByClassDto
  )
  .get(
    "/by-student-no/:studentNo",
    async ({ params: { studentNo } }) => {
      const student = await StudentService.findByStudentNo(Number(studentNo));
      if (!student) {
        throw new Error("Öğrenci bulunamadı");
      }
      return StudentFormatter.response(student);
    },
    studentByStudentNoDto
  );
