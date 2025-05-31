import prisma from "#core/prisma";
import { ConflictException, NotFoundException } from "#utils/http-errors";
import { Classroom, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getClassroomFilters } from "./dtos";
import {
  ClassroomCreatePayload,
  ClassroomIndexQuery,
  ClassroomUpdatePayload,
} from "./types";

export abstract class ClassroomService {
  private static async handlePrismaError(
    error: unknown,
    context: "find" | "create" | "update" | "delete" | "index"
  ) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new NotFoundException("Sınıf bulunamadı");
      }
      if (error.code === "P2002" && context === "create") {
        throw new ConflictException("Sınıf zaten mevcut");
      }
    }
  }

  private static async prepareClassroomPayloadForCreate(
    payloadRaw: ClassroomCreatePayload
  ): Promise<Omit<Prisma.ClassroomCreateInput, "id" | "createdAt">> {
    const { name } = payloadRaw;
    return { name };
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
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });

      return classrooms;
    } catch (error) {
      this.handlePrismaError(error, "find");
      throw error;
    }
  }

  static async show(where: Prisma.ClassroomWhereUniqueInput) {
    try {
      const classroom = await prisma.classroom.findUnique({
        where,
      });

      if (!classroom) {
        throw new NotFoundException("Sınıf bulunamadı");
      }
      return classroom;
    } catch (error) {
      this.handlePrismaError(error, "find");
    }
  }

  static async store(payload: ClassroomCreatePayload): Promise<Classroom> {
    try {
      const classroomData =
        await this.prepareClassroomPayloadForCreate(payload);
      const classroom = await prisma.classroom.create({
        data: classroomData,
      });
      return classroom;
    } catch (error) {
      this.handlePrismaError(error, "create");
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
      this.handlePrismaError(error, "update");
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
      await this.handlePrismaError(error, "delete");
      throw error;
    }
  }
}
