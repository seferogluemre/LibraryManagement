import { Prisma } from "@prisma/client";
import { BookAssignmentWithRelationsResponse } from "./types";

type BookAssignmentWithIncludes = Prisma.BookAssignmentGetPayload<{
  include: {
    student: {
      select: {
        id: true;
        name: true;
        studentNo: true;
        class: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    book: {
      select: {
        id: true;
        title: true;
        isbn: true;
        author: {
          select: {
            id: true;
            name: true;
          };
        };
        publisher: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    assignedBy: {
      select: {
        id: true;
        name: true;
        role: true;
      };
    };
  };
}>;

export abstract class BookAssignmentFormatter {
  static response(
    assignment: BookAssignmentWithIncludes
  ): BookAssignmentWithRelationsResponse {
    return {
      id: assignment.id,
      studentId: assignment.studentId,
      bookId: assignment.bookId,
      assignedById: assignment.assignedById,
      returnDue: assignment.returnDue,
      returned: assignment.returned,
      returnedAt: assignment.returnedAt,
      assignedAt: assignment.assignedAt,
      student: {
        id: assignment.student.id,
        name: assignment.student.name,
      },
      book: {
        id: assignment.book.id,
        title: assignment.book.title,
      },
      assignedBy: {
        id: assignment.assignedBy.id,
        name: assignment.assignedBy.name,
      },
      class: assignment.student.class
        ? {
            id: assignment.student.class.id,
            name: assignment.student.class.name,
          }
        : null,
      publisher: assignment.book.publisher
        ? {
            id: assignment.book.publisher.id,
            name: assignment.book.publisher.name,
          }
        : null,
    };
  }
}
