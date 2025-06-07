import prisma from "@core/prisma";
import { Classroom, Prisma } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
import { getClassroomFilters } from "./dtos";
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
      const [hasFilters, filters] = getClassroomFilters(query);

      const where: Prisma.ClassroomWhereInput = {};

      if (hasFilters && filters.length > 0) {
        where.OR = filters;
      }

      const classrooms = await prisma.classroom.findMany({
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
        orderBy: { name: "asc" },
      });

      return classrooms;
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
      const deletedClassroom = await prisma.classroom.delete({
        where: { id },
      });
      return deletedClassroom;
    } catch (error) {
      await HandleError.handlePrismaError(error, "classroom", "delete");
      throw error;
    }
  }
}
