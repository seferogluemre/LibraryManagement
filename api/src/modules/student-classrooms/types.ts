import { Static } from "elysia";
import { studentClassroomShowDto, studentClassroomTransferDto } from "./dtos";

export type StudentClassroomResponse = Static<
  (typeof studentClassroomShowDto.response)[200]
>;

export type StudentClassroomTransferPayload = Static<
  typeof studentClassroomTransferDto.body
>;

export type StudentClassroomParams = Static<
  typeof studentClassroomShowDto.params
>;

export interface StudentWithClassroom {
  id: string;
  name: string;
  email: string | null;
  studentNo: number;
  classId: string;
  class: {
    id: string;
    name: string;
  };
}

export interface ClassroomTransferRequest {
  newClassId: string;
  reason?: string;
}
