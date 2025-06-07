import prisma from "@core/prisma";
import { NotificationType } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { TeacherNotificationData } from "./types";

const modulName = "notification";

export abstract class NotificationService {
  static async create(
    userId: string,
    type: NotificationType,
    message: string,
    metadata?: any
  ) {
    try {
      return prisma.notification.create({
        data: {
          message,
          metadata,
          userId,
          type,
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, modulName, "create");
    }
  }

  static async overdueNotification(data: TeacherNotificationData) {
    try {
      const message = `${data.overdueStudents.length} ögrencinizin teslim etmedigi kitaplar bulunuyor`;

      return this.create(data.teacherId, "OVERDUE_BOOK", message, {
        student: data.overdueStudents,
        teacherEmail: data.teacherEmail,
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, modulName, "create");
    }
  }

  static async list(
    userId: string,
    filters?: { isRead?: boolean; type?: NotificationType }
  ) {
    try {
      return prisma.notification.findMany({
        where: {
          userId,
          ...filters,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, modulName, "find");
    }
  }

  static async markAsRead(id: string, userId: string) {
    try {
      return prisma.notification.update({
        where: {
          id,
          userId,
        },
        data: {
          isRead: true,
        },
      });
    } catch (error) {
      await HandleError.handlePrismaError(error, modulName, "update");
    }
  }
}
