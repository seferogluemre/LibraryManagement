import prisma from "@core/prisma";
import { BookAssignment, Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { ConflictException, NotFoundException } from "@utils/http-errors";
import { AuthService } from "../auth/service";
import { getBookAssignmentsFilters } from "./dtos";
import {
  BookAssignmentCreatePayload,
  BookAssignmentIndexQuery,
  BookAssignmentUpdatePayload,
} from "./types";

export abstract class BookAssignmentService {
  private static async getUserIdFromAuthHeader(
    authorizationHeader: string | undefined
  ): Promise<string> {
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new NotFoundException("Authorization header gerekli");
    }

    const token = authorizationHeader.substring(7);
    const user = await AuthService.validateToken(token);
    return user.id;
  }

  private static async validateBookAvailability(bookId: string): Promise<void> {
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { availableCopies: true, title: true },
    });

    if (!book) {
      throw new NotFoundException("Belirtilen kitap bulunamadı");
    }

    if (book.availableCopies <= 0) {
      throw new ConflictException(
        `"${book.title}" kitabının mevcut kopyası bulunmuyor`
      );
    }
  }

  private static async validateStudentExists(studentId: string): Promise<void> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true },
    });

    if (!student) {
      throw new NotFoundException("Belirtilen öğrenci bulunamadı");
    }
  }

  private static async checkActiveAssignment(
    studentId: string,
    bookId: string
  ): Promise<void> {
    const existingAssignment = await prisma.bookAssignment.findFirst({
      where: {
        studentId,
        bookId,
        returned: false,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        "Bu öğrenciye aynı kitap zaten atanmış ve henüz iade edilmemiş"
      );
    }
  }

  static async index(query?: BookAssignmentIndexQuery) {
    try {
      const [hasFilters, filters] = getBookAssignmentsFilters(query);

      let where: Prisma.BookAssignmentWhereInput = hasFilters
        ? { AND: filters }
        : {};

      if (query?.search) {
        const searchQuery = query.search;
        where = {
          ...where,
          OR: [
            {
              book: {
                title: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              student: {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            },
          ],
        };
      }

      return await prisma.bookAssignment.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
              publisher: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          assignedAt: "desc",
        },
      });
    } catch (error) {
      return [];
    }
  }

  static async show(where: Prisma.BookAssignmentWhereUniqueInput) {
    try {
      const assignment = await prisma.bookAssignment.findUniqueOrThrow({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
              publisher: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      return assignment;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "find");
      throw error;
    }
  }

  static async store(
    payload: BookAssignmentCreatePayload,
    authorizationHeader: string | undefined
  ) {
    try {
      // JWT'den kullanıcı ID'sini al - bu kısmı sen halledeceksin
      const assignedById =
        await this.getUserIdFromAuthHeader(authorizationHeader);

      // Validasyonlar
      await this.validateStudentExists(payload.student_id);
      await this.validateBookAvailability(payload.book_id);
      await this.checkActiveAssignment(payload.student_id, payload.book_id);

      // Transaction ile assignment oluştur ve kitap stok güncelle
      const result = await prisma.$transaction(async (tx) => {
        // Assignment oluştur
        const assignment = await tx.bookAssignment.create({
          data: {
            studentId: payload.student_id,
            bookId: payload.book_id,
            assignedById,
            returnDue: new Date(payload.return_due),
          },
          include: {
            student: {
              select: {
                id: true,
                name: true,
                studentNo: true,
                class: { select: { id: true, name: true } },
              },
            },
            book: {
              select: {
                id: true,
                title: true,
                isbn: true,
                author: { select: { id: true, name: true } },
                publisher: { select: { id: true, name: true } },
              },
            },
            assignedBy: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        });

        // Kitap stokunu azalt
        await tx.book.update({
          where: { id: payload.book_id },
          data: {
            availableCopies: {
              decrement: 1,
            },
          },
        });

        return assignment;
      });

      return result;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "create");
      throw error;
    }
  }

  static async returnBook(id: string) {
    try {
      const assignment = await prisma.bookAssignment.findUniqueOrThrow({
        where: { id },
        select: { returned: true, bookId: true },
      });

      if (assignment.returned) {
        throw new ConflictException("Bu kitap zaten iade edilmiş");
      }

      // Transaction ile iade işlemi ve stok güncelleme
      const result = await prisma.$transaction(async (tx) => {
        // Assignment'ı güncelle
        const updatedAssignment = await tx.bookAssignment.update({
          where: { id },
          data: {
            returned: true,
            returnedAt: new Date(),
          },
          include: {
            student: {
              select: {
                id: true,
                name: true,
                studentNo: true,
                class: { select: { id: true, name: true } },
              },
            },
            book: {
              select: {
                id: true,
                title: true,
                isbn: true,
                author: { select: { id: true, name: true } },
                publisher: { select: { id: true, name: true } },
              },
            },
            assignedBy: {
              select: {
                id: true,
                name: true,
                role: true,
              },
            },
          },
        });

        // Kitap stokunu artır
        await tx.book.update({
          where: { id: assignment.bookId },
          data: {
            availableCopies: {
              increment: 1,
            },
          },
        });

        return updatedAssignment;
      });

      return result;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "update");
      throw error;
    }
  }

  static async update(id: string, payload: BookAssignmentUpdatePayload) {
    try {
      const dataToUpdate: Prisma.BookAssignmentUpdateInput = {};

      if (payload.return_due !== undefined) {
        dataToUpdate.returnDue = payload.return_due;
      }

      const updatedAssignment = await prisma.bookAssignment.update({
        where: { id },
        data: dataToUpdate,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
              class: { select: { id: true, name: true } },
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
              author: { select: { id: true, name: true } },
              publisher: { select: { id: true, name: true } },
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      });

      return updatedAssignment;
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<BookAssignment> {
    try {
      const assignment = await prisma.bookAssignment.findUniqueOrThrow({
        where: { id },
        select: { returned: true, bookId: true },
      });

      if (!assignment.returned) {
        // Eğer iade edilmemiş assignment siliniyorsa stoku geri artır
        return await prisma.$transaction(async (tx) => {
          const deletedAssignment = await tx.bookAssignment.delete({
            where: { id },
          });

          await tx.book.update({
            where: { id: assignment.bookId },
            data: {
              availableCopies: {
                increment: 1,
              },
            },
          });

          return deletedAssignment;
        });
      } else {
        // İade edilmiş assignment, sadece sil
        return await prisma.bookAssignment.delete({
          where: { id },
        });
      }
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "delete");
      throw error;
    }
  }

  static async getOverdueAssignments() {
    try {
      const now = new Date();
      return await prisma.bookAssignment.findMany({
        where: {
          returned: false,
          returnDue: {
            lt: now,
          },
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
              class: { select: { id: true, name: true } },
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
              author: { select: { id: true, name: true } },
              publisher: { select: { id: true, name: true } },
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          returnDue: "asc",
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "find");
      return [];
    }
  }

  static async getStudentActiveAssignments(studentId: string) {
    try {
      return await prisma.bookAssignment.findMany({
        where: {
          studentId,
          returned: false,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
              class: { select: { id: true, name: true } },
            },
          },
          book: {
            select: {
              id: true,
              title: true,
              isbn: true,
              author: { select: { id: true, name: true } },
              publisher: { select: { id: true, name: true } },
            },
          },
          assignedBy: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          returnDue: "asc",
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, "book-assignment", "find");
      return [];
    }
  }
}
