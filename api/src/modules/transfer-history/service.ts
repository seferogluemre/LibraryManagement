import prisma from "#core/prisma";
import { NotFoundException } from "#utils/http-errors";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getTransferHistoryFilters } from "./dtos";
import type {
  CreateTransferHistoryRequest,
  TransferHistoryIndexQuery,
  TransferHistoryRecord,
} from "./types";

export abstract class TransferHistoryService {
  private static async handlePrismaError(
    error: unknown,
    context: "find" | "create" | "delete"
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundException("Transfer kaydı bulunamadı");
      }
    }
    throw error;
  }

  /**
   * Transfer geçmişini listele
   */
  static async index(query?: TransferHistoryIndexQuery) {
    try {
      const [hasFilters, filters] = getTransferHistoryFilters(query);

      const where: Prisma.TransferHistoryWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const transferHistory = await prisma.transferHistory.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          transferDate: "desc",
        },
      });

      return transferHistory;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  /**
   * Tek transfer kaydını göster
   */
  static async show(id: string): Promise<TransferHistoryRecord> {
    try {
      const transferRecord = await prisma.transferHistory.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!transferRecord) {
        throw new NotFoundException("Transfer kaydı bulunamadı");
      }

      return transferRecord;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  /**
   * Yeni transfer kaydı oluştur
   */
  static async create(
    data: CreateTransferHistoryRequest
  ): Promise<TransferHistoryRecord> {
    try {
      const { studentId, oldClassId, newClassId, notes } = data;

      const transferRecord = await prisma.transferHistory.create({
        data: {
          studentId,
          oldClassId,
          newClassId,
          notes,
        },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return transferRecord;
    } catch (error) {
      this.handlePrismaError(error, "create");
      throw error;
    }
  }

  /**
   * Öğrencinin transfer geçmişini getir
   */
  static async getStudentTransferHistory(
    studentId: string
  ): Promise<TransferHistoryRecord[]> {
    try {
      const transferHistory = await prisma.transferHistory.findMany({
        where: { studentId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          transferDate: "desc",
        },
      });

      return transferHistory;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  /**
   * Sınıftan yapılan transfer'ları getir
   */
  static async getTransfersFromClass(classId: string) {
    try {
      const transfers = await prisma.transferHistory.findMany({
        where: { oldClassId: classId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          transferDate: "desc",
        },
      });

      return transfers;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  /**
   * Sınıfa yapılan transfer'ları getir
   */
  static async getTransfersToClass(classId: string) {
    try {
      const transfers = await prisma.transferHistory.findMany({
        where: { newClassId: classId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          transferDate: "desc",
        },
      });

      return transfers;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  /**
   * Transfer kaydını sil
   */
  static async destroy(id: string) {
    try {
      const deletedRecord = await prisma.transferHistory.delete({
        where: { id },
      });
      return deletedRecord;
    } catch (error) {
      this.handlePrismaError(error, "delete");
      throw error;
    }
  }

  /**
   * Son N adet transfer'ı getir
   */
  static async getRecentTransfers(limit: number = 10) {
    try {
      const transfers = await prisma.transferHistory.findMany({
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              studentNo: true,
            },
          },
          oldClass: {
            select: {
              id: true,
              name: true,
            },
          },
          newClass: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          transferDate: "desc",
        },
      });

      return transfers;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }
}
