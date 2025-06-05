import prisma from "#core/prisma";
import { HandleError } from "#shared/error/handle-error";
import { ReportsResponse } from "./types";

export abstract class ReportsService {
  static async getTopStudents(limit: number = 5) {
    try {
      const students = await prisma.student.findMany({
        select: {
          id: true,
          name: true,
          studentNo: true,
          class: {
            select: {
              name: true,
            },
          },
          assignments: {
            select: {
              returned: true,
            },
          },
        },
      });

      const result = students.map((student) => {
        const totalBooksRead = student.assignments.filter(
          (a) => a.returned
        ).length;
        const currentlyBorrowedBooks = student.assignments.filter(
          (a) => !a.returned
        ).length;
        return {
          id: student.id,
          name: student.name,
          studentNo: student.studentNo,
          className: student.class.name,
          totalBooksRead,
          currentlyBorrowedBooks,
        };
      });

      return result
        .sort((a, b) => b.totalBooksRead - a.totalBooksRead)
        .slice(0, limit);
    } catch (error) {
      await HandleError.handlePrismaError(error, "reports", "find");
      throw error;
    }
  }

  static async getTopBooks(limit: number = 5) {
    try {
      const books = await prisma.book.findMany({
        select: {
          id: true,
          title: true,
          author: { select: { name: true } },
          category: { select: { name: true } },
          totalCopies: true,
          availableCopies: true,
          assignments: { select: { id: true } },
        },
      });

      const result = books.map((book) => ({
        id: book.id,
        title: book.title,
        authorName: book.author.name,
        categoryName: book.category?.name,
        totalTimesRead: book.assignments.length,
        currentlyAvailable: book.availableCopies,
        totalCopies: book.totalCopies,
      }));

      return result
        .sort((a, b) => b.totalTimesRead - a.totalTimesRead)
        .slice(0, limit);
    } catch (error) {
      await HandleError.handlePrismaError(error, "reports", "find");
      throw error;
    }
  }

  static async getSystemStats() {
    const [
      totalBooks,
      totalStudents,
      totalActiveAssignments,
      totalOverdueBooks,
      totalReturnedBooks,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.student.count(),
      prisma.bookAssignment.count({ where: { returned: false } }),
      prisma.bookAssignment.count({
        where: { returned: false, returnDue: { lt: new Date() } },
      }),
      prisma.bookAssignment.count({ where: { returned: true } }),
    ]);

    return {
      totalBooks,
      totalStudents,
      totalActiveAssignments,
      totalOverdueBooks,
      totalReturnedBooks,
    };
  }

  static async getOverdueBooks() {
    const assignments = await prisma.bookAssignment.findMany({
      where: {
        returned: false,
        returnDue: { lt: new Date() },
      },
      select: {
        id: true,
        assignedAt: true,
        returnDue: true,
        student: {
          select: {
            id: true,
            name: true,
            studentNo: true,
            class: { select: { name: true } },
          },
        },
        book: {
          select: {
            title: true,
            author: { select: { name: true } },
          },
        },
        assignedBy: { select: { name: true } },
      },
    });

    return assignments.map((a) => ({
      assignmentId: a.id,
      studentId: a.student.id,
      studentName: a.student.name,
      studentNo: a.student.studentNo,
      className: a.student.class.name,
      bookTitle: a.book.title,
      authorName: a.book.author.name,
      assignedAt: a.assignedAt,
      returnDue: a.returnDue,
      daysOverdue: Math.floor(
        (Date.now() - a.returnDue.getTime()) / (1000 * 60 * 60 * 24)
      ),
      assignedByName: a.assignedBy.name,
    }));
  }

  static async getReports(limit = 5): Promise<ReportsResponse> {
    const [topStudents, topBooks, systemStats, overdueBooks] =
      await Promise.all([
        ReportsService.getTopStudents(limit),
        ReportsService.getTopBooks(limit),
        ReportsService.getSystemStats(),
        ReportsService.getOverdueBooks(),
      ]);
    return { topStudents, topBooks, systemStats, overdueBooks };
  }
}
