import { BaseFormatter } from "#utils/base-formatter";
import { Classroom } from "@prisma/client";
import { classroomResponseSchema } from "./dtos";
import { ClassroomShowResponse } from "./types";

type ClassroomWithStudents = Classroom & {
  students: {
    id: string;
    name: string;
    email: string | null;
    studentNo: number;
  }[];
};

export abstract class ClassroomFormatter {
  static response(data: Classroom) {
    const convertedData = BaseFormatter.convertData<ClassroomShowResponse>(
      data,
      classroomResponseSchema
    );
    return convertedData;
  }

  static responseWithStudents(data: ClassroomWithStudents) {
    return {
      id: data.id,
      name: data.name,
      createdAt: data.createdAt,
      students: data.students.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email || undefined,
        studentNo: student.studentNo,
      })),
    };
  }

  static listResponseWithStudents(classrooms: ClassroomWithStudents[]) {
    return classrooms.map((classroom) => this.responseWithStudents(classroom));
  }
}
