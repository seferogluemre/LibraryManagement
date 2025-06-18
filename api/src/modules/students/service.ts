import prisma from "@core/prisma";
import { Prisma, Student } from "@prisma/client";
import { HandleError } from "@shared/error/handle-error";
import { NotFoundException } from "@utils/http-errors";
import {
    StudentCreatePayload,
    StudentIndexQuery,
    StudentUpdatePayload,
} from "./types";

export abstract class StudentService {
  private static async prepareStudentPayloadForCreate(
    payloadRaw: StudentCreatePayload
  ): Promise<Omit<Prisma.StudentCreateInput, "id">> {
    const { name, email, studentNo, classId } = payloadRaw;

    const classExists = await prisma.classroom.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      throw new NotFoundException("Belirtilen sınıf bulunamadı");
    }

    return {
      name,
      email: email || null,
      studentNo,
      class: {
        connect: { id: classId },
      },
    };
  }

  private static async prepareStudentPayloadForUpdate(
    payloadRaw: StudentUpdatePayload
  ): Promise<Prisma.StudentUpdateInput> {
    const { name, email, studentNo, classId } = payloadRaw;
    const dataToUpdate: Prisma.StudentUpdateInput = {};

    if (name) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email || null;
    if (studentNo) dataToUpdate.studentNo = studentNo;

    if (classId) {
      // Sınıfın var olduğunu kontrol et
      const classExists = await prisma.classroom.findUnique({
        where: { id: classId },
      });

      if (!classExists) {
        throw new NotFoundException("Belirtilen sınıf bulunamadı");
      }

      dataToUpdate.class = {
        connect: { id: classId },
      };
    }

    return dataToUpdate;
  }

  static async index(query?: StudentIndexQuery) {
    try {
      const { page = 1, limit = 10, name } = query || {};
      const skip = (page - 1) * limit;

      const where: Prisma.StudentWhereInput = {};
      if (name) {
        where.name = {
          contains: name,
          mode: "insensitive",
        };
      }

      const [total, students] = await prisma.$transaction([
        prisma.student.count({ where }),
        prisma.student.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: "asc" },
           include: {
            class: true,
          },
        }),
      ]);

      return {
        data: students,
        total,
        page,
        limit,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "find");
      throw error;
    }
  }

  static async show(where: Prisma.StudentWhereUniqueInput) {
    try {
      const student = await prisma.student.findUnique({
        where,
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!student) {
        throw new NotFoundException("Öğrenci bulunamadı");
      }
      return student;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "find");
      throw error;
    }
  }

  static async store(
    payload: StudentCreatePayload
  ): Promise<Student & { class: { id: string; name: string } }> {
    try {
      const studentData = await this.prepareStudentPayloadForCreate(payload);
      const student = await prisma.student.create({
        data: studentData,
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return student;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "create");
      throw error;
    }
  }

  static async update(
    id: string,
    payload: StudentUpdatePayload
  ): Promise<Student & { class: { id: string; name: string } }> {
    try {
      console.log("gelen id service", id);
      console.log("gelen payload service", payload);
      const updateData = await this.prepareStudentPayloadForUpdate(payload);

      if (Object.keys(updateData).length === 0) {
        const currentStudent = await this.show({ id });
        return currentStudent;
      }

      const updatedStudent = await prisma.student.update({
        where: { id },
        data: updateData,
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return updatedStudent;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "update");
      throw error;
    }
  }

  static async destroy(params: { id: string }): Promise<Student> {
    try {
      const deletedStudent = await prisma.student.delete({
        where: {
          id:params.params.id
        },
      });
      return deletedStudent;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "delete");
      throw error;
    }
  }

  /**
   * Belirli bir sınıftaki öğrencileri listele
   */
  static async getStudentsByClass(classId: string) {
    try {
      const students = await prisma.student.findMany({
        where: { classId },
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          studentNo: "asc",
        },
      });
      return students;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "find");
      throw error;
    }
  }

  /**
   * Öğrenci numarasına göre öğrenci bul
   */
  static async findByStudentNo(studentNo: number) {
    try {
      const student = await prisma.student.findUnique({
        where: { studentNo },
        include: {
          class: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return student;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student", "find");
      throw error;
    }
  }
}
