import { ControllerHook } from "@utils/elysia-types";
import { t } from "elysia";

export const topStudentsSchema = t.Object({
  id: t.String(),
  name: t.String(),
  studentNo: t.Number(),
  className: t.String(),
  totalBooksRead: t.Number(),
  currentlyBorrowedBooks: t.Number(),
});

export const topBooksSchema = t.Object({
  id: t.String(),
  title: t.String(),
  authorName: t.String(),
  categoryName: t.Optional(t.String()),
  totalTimesRead: t.Number(),
  currentlyAvailable: t.Number(),
  totalCopies: t.Number(),
});

export const systemStatsSchema = t.Object({
  totalBooks: t.Number(),
  totalStudents: t.Number(),
  totalActiveAssignments: t.Number(),
  totalOverdueBooks: t.Number(),
  totalReturnedBooks: t.Number(),
});

export const overdueBooksSchema = t.Object({
  assignmentId: t.String(),
  studentId: t.String(),
  studentName: t.String(),
  className: t.String(),
  bookTitle: t.String(),
  authorName: t.String(),
  assignedAt: t.Date(),
  returnDue: t.Date(),
  daysOverdue: t.Number(),
  assignedByName: t.String(),
});

export const reportResponseSchema = t.Object({
  topStudents: t.Array(topStudentsSchema),
  topBooks: t.Array(topBooksSchema),
  systemStats: t.Array(systemStatsSchema),
  overdueBooks: t.Array(overdueBooksSchema),
});

export const reportIndexDto = {
  query: t.Object({
    limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
  }),
  response: {
    200: reportResponseSchema,
  },
  detail: {
    summary: "Sistem Raporlarını Getir",
    description:
      "En çok okuyan öğrenciler, en çok okunan kitaplar, sistem istatistikleri ve geciken kitapları getirir",
  },
} satisfies ControllerHook;
