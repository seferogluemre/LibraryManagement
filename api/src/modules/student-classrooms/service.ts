import prisma from "#core/prisma";
import { HandleError } from "#shared/error/handle-error";
import { ConflictException, NotFoundException } from "#utils/http-errors";
import { StudentService } from "@modules/students/service";
import { TransferHistoryService } from "@modules/transfer-histories/service";
import type { ClassroomTransferRequest, StudentWithClassroom } from "./types";

export abstract class StudentClassroomService {
  /**
   * Öğrencinin sınıf bilgisini getir
   */
  static async getStudentClassroom(
    studentId: string
  ): Promise<StudentWithClassroom> {
    try {
      const student = await StudentService.show({ id: studentId });

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        studentNo: student.studentNo,
        classId: student.classId,
        class: student.class,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, "student-classroom", "find");
      throw error;
    }
  }

  /**
   * Öğrenciyi başka sınıfa transfer et
   */
  static async transferStudent(
    studentId: string,
    transferData: ClassroomTransferRequest
  ): Promise<StudentWithClassroom> {
    try {
      const { newClassId, reason } = transferData;

      const currentStudent = await StudentService.show({ id: studentId });

      if (currentStudent.classId === newClassId) {
        throw new ConflictException("Öğrenci zaten bu sınıfta bulunuyor");
      }

      const newClassExists = await prisma.classroom.findUnique({
        where: { id: newClassId },
      });

      if (!newClassExists) {
        throw new NotFoundException("Belirtilen yeni sınıf bulunamadı");
      }

      const updatedStudent = await StudentService.update(studentId, {
        classId: newClassId,
      });

      // Transfer geçmişini kaydet
      await TransferHistoryService.create({
        studentId: studentId,
        oldClassId: currentStudent.classId,
        newClassId: newClassId,
        notes: reason,
      });

      return {
        id: updatedStudent.id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        studentNo: updatedStudent.studentNo,
        classId: updatedStudent.classId,
        class: updatedStudent.class,
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, "student-classroom", "update");
      throw error;
    }
  }

  /**
   * Öğrenciyi sınıftan çıkar (sınıfı null yapmaz, schema'da required olduğu için)
   * Bunun yerine özel bir "Sınıfsız" sınıfı oluşturulabilir
   */
  static async removeStudentFromClassroom(studentId: string): Promise<{
    message: string;
    student: {
      id: string;
      name: string;
      studentNo: number;
    };
  }> {
    try {
      // Öğrencinin mevcut durumunu kontrol et
      const currentStudent = await StudentService.show({ id: studentId });

      // "Sınıfsız" öğrenciler için özel sınıf oluştur veya bul
      let unassignedClass = await prisma.classroom.findFirst({
        where: { name: "Sınıfsız Öğrenciler" },
      });

      if (!unassignedClass) {
        unassignedClass = await prisma.classroom.create({
          data: { name: "Sınıfsız Öğrenciler" },
        });
      }

      // Öğrenciyi "Sınıfsız" sınıfına ata
      await StudentService.update(studentId, {
        classId: unassignedClass.id,
      });

      // Transfer geçmişini kaydet
      await TransferHistoryService.create({
        studentId: studentId,
        oldClassId: currentStudent.classId,
        newClassId: unassignedClass.id,
        notes: "Öğrenci sınıftan çıkarıldı",
      });

      return {
        message: "Öğrenci sınıftan çıkarıldı",
        student: {
          id: currentStudent.id,
          name: currentStudent.name,
          studentNo: currentStudent.studentNo,
        },
      };
    } catch (error) {
      await HandleError.handlePrismaError(error, "student-classroom", "update");
      throw error;
    }
  }

  /**
   * Sınıftaki öğrenci sayısını getir
   */
  static async getClassroomStudentCount(classId: string): Promise<number> {
    try {
      const count = await prisma.student.count({
        where: { classId },
      });
      return count;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student-classroom", "find");
      throw error;
    }
  }

  /**
   * Öğrencinin transfer geçmişini getir
   */
  static async getStudentTransferHistory(studentId: string) {
    try {
      const history =
        await TransferHistoryService.getStudentTransferHistory(studentId);
      return history;
    } catch (error) {
      await HandleError.handlePrismaError(error, "student-classroom", "find");
      throw error;
    }
  }

  /**
   * Toplu transfer işlemi
   */
  static async bulkTransferStudents(
    studentIds: string[],
    newClassId: string,
    reason?: string
  ): Promise<{
    successful: string[];
    failed: { studentId: string; error: string }[];
  }> {
    const successful: string[] = [];
    const failed: { studentId: string; error: string }[] = [];

    for (const studentId of studentIds) {
      try {
        await this.transferStudent(studentId, { newClassId, reason });
        successful.push(studentId);
      } catch (error) {
        failed.push({
          studentId,
          error: error instanceof Error ? error.message : "Bilinmeyen hata",
        });
      }
    }

    return { successful, failed };
  }
}
