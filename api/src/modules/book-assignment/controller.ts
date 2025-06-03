import Elysia from "elysia";
import {
  bookAssignmentCreateDto,
  bookAssignmentDestroyDto,
  bookAssignmentIndexDto,
  bookAssignmentOverdueDto,
  bookAssignmentReturnDto,
  bookAssignmentShowDto,
  bookAssignmentStudentActiveDto,
  bookAssignmentUpdateDto,
} from "./dtos";
import { BookAssignmentFormatter } from "./formatters";
import { BookAssignmentService } from "./service";

export const app = new Elysia({
  prefix: "/book-assignments",
  name: "BookAssignment",
  detail: {
    tags: ["Book Assignments"],
  },
})
  .post(
    "",
    async ({ body, headers }) => {
      const assignment = await BookAssignmentService.store(
        body,
        headers.authorization
      );
      return BookAssignmentFormatter.response(assignment);
    },
    bookAssignmentCreateDto
  )
  .get(
    "",
    async ({ query }) => {
      const assignments = await BookAssignmentService.index(query);
      return assignments.map(BookAssignmentFormatter.response);
    },
    bookAssignmentIndexDto
  )
  .get(
    "/overdue",
    async () => {
      const overdueAssignments =
        await BookAssignmentService.getOverdueAssignments();
      return overdueAssignments.map(BookAssignmentFormatter.response);
    },
    bookAssignmentOverdueDto
  )
  .get(
    "/student/:studentId",
    async ({ params: { studentId } }) => {
      const studentAssignments =
        await BookAssignmentService.getStudentActiveAssignments(studentId);
      return studentAssignments.map(BookAssignmentFormatter.response);
    },
    bookAssignmentStudentActiveDto
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const assignment = await BookAssignmentService.show({ id });
      return BookAssignmentFormatter.response(assignment);
    },
    bookAssignmentShowDto
  )
  .patch(
    "/:id/return",
    async ({ params: { id } }) => {
      const returnedAssignment = await BookAssignmentService.returnBook(id);
      return BookAssignmentFormatter.response(returnedAssignment);
    },
    bookAssignmentReturnDto
  )
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      const updatedAssignment = await BookAssignmentService.update(id, body);
      return BookAssignmentFormatter.response(updatedAssignment);
    },
    bookAssignmentUpdateDto
  )
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      await BookAssignmentService.destroy(id);
      return { message: "Kitap ataması başarıyla silindi" };
    },
    bookAssignmentDestroyDto
  );
