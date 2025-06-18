import prisma from "@core/prisma";
import { Classroom, Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
import {
    ClassroomCreatePayload,
    ClassroomIndexQuery,
    ClassroomUpdatePayload,
} from "./types";

export abstract class ClassroomService {
  private static async prepareClassroomPayloadForCreate(
    payloadRaw: ClassroomCreatePayload,
    createdById: string
  ): Promise<Prisma.ClassroomCreateInput> {
    const { name } = payloadRaw;
    return {
      name,
      createdBy: {
        connect: {
          id: createdById,
        },
      },
    };
  }

  private static async prepareClasroomPayloadForUpdate(
    payloadRaw: ClassroomUpdatePayload
  ): Promise<Prisma.UserUpdateInput> {
    const { name } = payloadRaw;
    const dataToUpdate: Prisma.ClassroomUpdateInput = {};
    if (name) dataToUpdate.name = name;
    return dataToUpdate;
  }

  static async index(query?: ClassroomIndexQuery) {
    try {
      const { page = 1, limit = 10 } = query || {};
      const skip = (page - 1) * limit;

      const [total, classrooms] = await prisma.$transaction([
        prisma.classroom.count(),
        prisma.classroom.findMany({
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
      ]);

      return {
        data: classrooms,
        total,
        page,
        limit,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "find");
      throw error;
    }
  }

  static async show(where: Prisma.ClassroomWhereUniqueInput) {
    try {
      const classroom = await prisma.classroom.findUnique({
        where,
        include: {
          students: {
            select: {
              id: true,
              name: true,
              email: true,
              studentNo: true,
            },
            orderBy: {
              studentNo: "asc",
            },
          },
        },
      });

      if (!classroom) {
        throw new NotFoundException("Sınıf bulunamadı");
      }
      return classroom;
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "find");
      throw error;
    }
  }

  static async store(
    payload: ClassroomCreatePayload,
    createdById: string
  ): Promise<Classroom> {
    try {
      const classroomData = await this.prepareClassroomPayloadForCreate(
        payload,
        createdById
      );
      const classroom = await prisma.classroom.create({
        data: classroomData,
      });
      return classroom;
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: ClassroomUpdatePayload
  ): Promise<Classroom> {
    try {
      const updatedData = await this.prepareClasroomPayloadForUpdate(payload);

      if (Object.keys(updatedData).length == 0) {
        const currentClassroom = await prisma.classroom.findUnique({
          where: { id },
        });
        if (!currentClassroom) throw new NotFoundException("Sınıf bulunamadı");
        return currentClassroom;
      }

      const updatedClassroom = await prisma.classroom.update({
        where: { id },
        data: updatedData,
      });
      return updatedClassroom;
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "update");
      throw error;
    }
  }

  static async destroy(id: string): Promise<Classroom> {
    try {
      const deletedClassroom = await prisma.$transaction(async (tx) => {
        const unclassifiedClassName = "Sınıfsız";
        let unclassifiedClass = await tx.classroom.findFirst({
          where: { name: unclassifiedClassName },
        });

        if (!unclassifiedClass) {
          const adminUser = await tx.user.findFirst({
            where: { role: "ADMIN" },
          });

          if (!adminUser) {
            throw new Error(
              "Sınıfsız sınıfı oluşturmak için bir admin kullanıcı bulunamadı."
            );
          }

          unclassifiedClass = await tx.classroom.create({
            data: {
              name: unclassifiedClassName,
              createdById: adminUser.id,
            },
          });
        }

        await tx.transferHistory.updateMany({
          where: { oldClassId: id },
          data: { oldClassId: unclassifiedClass.id },
        });

        await tx.transferHistory.updateMany({
          where: { newClassId: id },
          data: { newClassId: unclassifiedClass.id },
        });

        await tx.student.updateMany({
          where: { classId: id },
          data: { classId: unclassifiedClass.id },
        });

        const classroomToDelete = await tx.classroom.delete({
          where: { id },
        });

        return classroomToDelete;
      });
      return deletedClassroom;
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "delete");
      throw error;
    }
  }
}
