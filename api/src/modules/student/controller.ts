import Elysia, { t } from "elysia";
import {
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
    async ({ params: { id }, body }) => {
      const updatedStudent = await StudentService.update(id, body);
      return StudentFormatter.response(updatedStudent);
    },
    studentUpdateDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await StudentService.destroy(id);
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
    {
      params: t.Object({
        classId: t.String(),
      }),
      response: {
        200: studentIndexDto.response[200],
        404: studentDestroyDto.response[404],
      },
      detail: {
        summary: "Sınıfa Göre Öğrencileri Listele",
        description: "Belirli bir sınıftaki tüm öğrencileri listeler",
      },
    }
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
    {
      params: t.Object({
        studentNo: t.String(),
      }),
      response: {
        200: studentShowDto.response[200],
        404: studentDestroyDto.response[404],
      },
      detail: {
        summary: "Öğrenci Numarasına Göre Öğrenci Bul",
        description: "Öğrenci numarası ile öğrenci arar",
      },
    }
  );
