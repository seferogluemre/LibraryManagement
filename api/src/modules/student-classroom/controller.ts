import Elysia, { t } from "elysia";
import {
  studentClassroomRemoveDto,
  studentClassroomShowDto,
  studentClassroomTransferDto,
} from "./dtos";
import { StudentClassroomFormatter } from "./formatters";
import { StudentClassroomService } from "./service";

export const app = new Elysia({
  prefix: "/student-classroom",
  name: "StudentClassroom",
  detail: {
    tags: ["Student-Classroom"],
  },
})
  .get(
    "/:studentId",
    async ({ params: { studentId } }) => {
      const studentClassroom =
        await StudentClassroomService.getStudentClassroom(studentId);
      return StudentClassroomFormatter.response(studentClassroom);
    },
    studentClassroomShowDto
  )
  .patch(
    "/:studentId/transfer",
    async ({ params: { studentId }, body }) => {
      const transferredStudent = await StudentClassroomService.transferStudent(
        studentId,
        body
      );
      return StudentClassroomFormatter.response(transferredStudent);
    },
    studentClassroomTransferDto
  )
  .delete(
    "/:studentId/remove",
    async ({ params: { studentId } }) => {
      const result =
        await StudentClassroomService.removeStudentFromClassroom(studentId);
      return StudentClassroomFormatter.removeResponse(result);
    },
    studentClassroomRemoveDto
  )
  .get(
    "/:studentId/history",
    async ({ params: { studentId } }) => {
      const history =
        await StudentClassroomService.getStudentTransferHistory(studentId);
      return StudentClassroomFormatter.transferHistoryResponse(history);
    },
    {
      params: t.Object({
        studentId: t.String(),
      }),
      response: {
        200: t.Array(
          t.Object({
            classId: t.String(),
            className: t.String(),
            transferDate: t.Date(),
            reason: t.Optional(t.String()),
          })
        ),
        404: studentClassroomShowDto.response[404],
      },
      detail: {
        summary: "Öğrencinin Transfer Geçmişi",
        description: "Öğrencinin sınıf değişiklik geçmişini gösterir",
      },
    }
  )
  .post(
    "/bulk-transfer",
    async ({ body }) => {
      const { studentIds, newClassId, reason } = body;
      const result = await StudentClassroomService.bulkTransferStudents(
        studentIds,
        newClassId,
        reason
      );
      return StudentClassroomFormatter.bulkTransferResponse(result);
    },
    {
      body: t.Object({
        studentIds: t.Array(t.String(), {
          description: "Transfer edilecek öğrenci ID'leri",
        }),
        newClassId: t.String({
          description: "Yeni sınıf ID'si",
        }),
        reason: t.Optional(
          t.String({
            description: "Transfer sebebi",
          })
        ),
      }),
      response: {
        200: t.Object({
          summary: t.Object({
            total: t.Number(),
            successful: t.Number(),
            failed: t.Number(),
          }),
          details: t.Object({
            successful: t.Array(t.String()),
            failed: t.Array(
              t.Object({
                studentId: t.String(),
                error: t.String(),
              })
            ),
          }),
        }),
        404: studentClassroomShowDto.response[404],
        422: studentClassroomTransferDto.response[422],
      },
      detail: {
        summary: "Toplu Öğrenci Transferi",
        description:
          "Birden fazla öğrenciyi aynı anda başka sınıfa transfer eder",
      },
    }
  )
  .get(
    "/class/:classId/count",
    async ({ params: { classId } }) => {
      const count =
        await StudentClassroomService.getClassroomStudentCount(classId);
      return {
        classId,
        studentCount: count,
      };
    },
    {
      params: t.Object({
        classId: t.String(),
      }),
      response: {
        200: t.Object({
          classId: t.String(),
          studentCount: t.Number(),
        }),
        404: studentClassroomShowDto.response[404],
      },
      detail: {
        summary: "Sınıf Öğrenci Sayısı",
        description: "Belirtilen sınıftaki öğrenci sayısını döner",
      },
    }
  );
