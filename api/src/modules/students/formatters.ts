import { BaseFormatter } from "#utils/base-formatter";
import { Student } from "@prisma/client";
import { studentWithClassResponseSchema } from "./dtos";
import { StudentResponse } from "./types";

type StudentWithClass = Student & {
  class: {
    id: string;
    name: string;
  };
};

export abstract class StudentFormatter {
  static response(data: StudentWithClass) {
    const convertedData = BaseFormatter.convertData<StudentResponse>(
      data,
      studentWithClassResponseSchema
    );
    return convertedData;
  }

  /**
   * Sadece öğrenci bilgilerini formatla (sınıf bilgisi olmadan)
   */
  static basicResponse(data: Student) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      studentNo: data.studentNo,
      classId: data.classId,
    };
  }

  /**
   * Öğrenci listesi için özel format
   */
  static listResponse(students: StudentWithClass[]) {
    return students.map((student) => this.response(student));
  }
}
