import type { StudentWithClassroom } from "./types";

export abstract class StudentClassroomFormatter {
  /**
   * Student classroom response formatı
   */
  static response(data: StudentWithClassroom) {
    return {
      id: data.id,
      name: data.name,
      email: data.email || undefined, // null'ı undefined'a çevir
      studentNo: data.studentNo,
      classId: data.classId,
      class: {
        id: data.class.id,
        name: data.class.name,
      },
    };
  }

  /**
   * Remove response formatı
   */
  static removeResponse(data: {
    message: string;
    student: {
      id: string;
      name: string;
      studentNo: number;
    };
  }) {
    return {
      message: data.message,
      student: {
        id: data.student.id,
        name: data.student.name,
        studentNo: data.student.studentNo,
      },
    };
  }

  /**
   * Bulk transfer response formatı
   */
  static bulkTransferResponse(data: {
    successful: string[];
    failed: { studentId: string; error: string }[];
  }) {
    return {
      summary: {
        total: data.successful.length + data.failed.length,
        successful: data.successful.length,
        failed: data.failed.length,
      },
      details: {
        successful: data.successful,
        failed: data.failed,
      },
    };
  }

  /**
   * Transfer history response formatı (gelecek için)
   */
  static transferHistoryResponse(data: any[]) {
    return data.map((item) => ({
      classId: item.classId,
      className: item.className,
      transferDate: item.transferDate,
      reason: item.reason || undefined,
    }));
  }
}
