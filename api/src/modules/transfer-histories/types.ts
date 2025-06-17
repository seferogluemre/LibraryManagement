import { Static } from "elysia";
import {
  transferHistoryCreateDto,
  transferHistoryIndexDto,
  transferHistoryShowDto,
} from "./dtos";

export type TransferHistoryResponse = Static<
  (typeof transferHistoryShowDto.response)[200]
>;

export type TransferHistoryCreatePayload = Static<
  typeof transferHistoryCreateDto.body
>;

export type TransferHistoryIndexQuery = Static<
  typeof transferHistoryIndexDto.query
>;

export interface TransferHistoryRecord {
  id: string;
  studentId: string;
  oldClassId: string;
  newClassId: string;
  notes?: string;
  transferDate: Date;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  student: {
    id: string;
    name: string;
    studentNo: number;
  };
  oldClass: {
    id: string;
    name: string;
  };
  newClass: {
    id: string;
    name: string;
  };
}

export interface CreateTransferHistoryRequest {
  studentId: string;
  oldClassId: string;
  newClassId: string;
  notes?: string;
}
