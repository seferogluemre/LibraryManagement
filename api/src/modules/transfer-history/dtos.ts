import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

export function getTransferHistoryFilters(query?: {
  studentId?: string;
  oldClassId?: string;
  newClassId?: string;
  fromDate?: Date;
  toDate?: Date;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.TransferHistoryWhereInput[] = [];
  const { studentId, oldClassId, newClassId, fromDate, toDate } = query;

  if (studentId) {
    filters.push({ studentId });
  }

  if (oldClassId) {
    filters.push({ oldClassId });
  }

  if (newClassId) {
    filters.push({ newClassId });
  }

  if (fromDate || toDate) {
    const dateFilter: any = {};
    if (fromDate) dateFilter.gte = fromDate;
    if (toDate) dateFilter.lte = toDate;
    filters.push({ transferDate: dateFilter });
  }

  return [filters.length > 0, filters, undefined] as const;
}

// Response schemas
export const transferHistoryResponseSchema = t.Object({
  id: t.String(),
  studentId: t.String(),
  oldClassId: t.String(),
  newClassId: t.String(),
  notes: t.Optional(t.String()),
  transferDate: t.Date(),
  createdAt: t.Date(),
  student: t.Object({
    id: t.String(),
    name: t.String(),
    studentNo: t.Number(),
  }),
  oldClass: t.Object({
    id: t.String(),
    name: t.String(),
  }),
  newClass: t.Object({
    id: t.String(),
    name: t.String(),
  }),
});

// DTOs
export const transferHistoryIndexDto = {
  query: t.Object({
    studentId: t.Optional(t.String()),
    oldClassId: t.Optional(t.String()),
    newClassId: t.Optional(t.String()),
    fromDate: t.Optional(t.Date()),
    toDate: t.Optional(t.Date()),
  }),
  response: { 200: t.Array(transferHistoryResponseSchema) },
  detail: {
    summary: "Transfer Geçmişini Listele",
    description: "Öğrenci transfer geçmişlerini filtreleme ile listeler",
  },
} satisfies ControllerHook;

export const transferHistoryShowDto = {
  params: t.Object({
    id: t.String(),
  }),
  response: {
    200: transferHistoryResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Transfer Kaydını Göster",
    description: "Belirtilen transfer kaydının detaylarını gösterir",
  },
} satisfies ControllerHook;

export const transferHistoryCreateDto = {
  body: t.Object({
    studentId: t.String({
      description: "Transfer edilen öğrenci ID'si",
    }),
    oldClassId: t.String({
      description: "Eski sınıf ID'si",
    }),
    newClassId: t.String({
      description: "Yeni sınıf ID'si",
    }),
    notes: t.Optional(
      t.String({
        description: "Transfer notları (opsiyonel)",
      })
    ),
  }),
  response: {
    200: transferHistoryResponseSchema,
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Transfer Kaydı Oluştur",
    description: "Öğrenci transfer işlemi için yeni kayıt oluşturur",
  },
} satisfies ControllerHook;

export const transferHistoryStudentDto = {
  params: t.Object({
    studentId: t.String(),
  }),
  response: {
    200: t.Array(transferHistoryResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrencinin Transfer Geçmişi",
    description: "Belirtilen öğrencinin tüm transfer geçmişini gösterir",
  },
} satisfies ControllerHook;
