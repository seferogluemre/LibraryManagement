import Elysia from "elysia";
import { TransferHistoryFormatter } from "../transfer-history/formatters";
import {
  studentClassroomBulkTransferDto,
  studentClassroomClassCountDto,
  studentClassroomHistoryDto,
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
      return TransferHistoryFormatter.listResponse(history);
    },
    studentClassroomHistoryDto
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
    studentClassroomBulkTransferDto
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
    studentClassroomClassCountDto
  );
