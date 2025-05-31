import { t } from "elysia";

import { StudentPlain } from "../../../prisma/prismabox/Student";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

// Response schemas
export const studentClassroomResponseSchema = t.Object({
  id: StudentPlain.properties.id,
  name: StudentPlain.properties.name,
  email: t.Optional(StudentPlain.properties.email),
  studentNo: StudentPlain.properties.studentNo,
  classId: StudentPlain.properties.classId,
  class: t.Object({
    id: t.String(),
    name: t.String(),
  }),
});

// DTOs
export const studentClassroomShowDto = {
  params: t.Object({
    studentId: StudentPlain.properties.id,
  }),
  response: {
    200: studentClassroomResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrencinin Sınıf Bilgisini Getir",
    description: "Belirtilen öğrencinin hangi sınıfta olduğunu gösterir",
  },
} satisfies ControllerHook;

export const studentClassroomTransferDto = {
  params: t.Object({
    studentId: StudentPlain.properties.id,
  }),
  body: t.Object({
    newClassId: t.String({
      description: "Öğrencinin transfer edileceği yeni sınıf ID'si",
    }),
    reason: t.Optional(
      t.String({
        description: "Transfer sebebi (opsiyonel)",
      })
    ),
  }),
  response: {
    200: studentClassroomResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Öğrenciyi Başka Sınıfa Transfer Et",
    description: "Öğrenciyi mevcut sınıfından çıkarıp yeni sınıfa atar",
  },
} satisfies ControllerHook;

export const studentClassroomRemoveDto = {
  params: t.Object({
    studentId: StudentPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
      student: t.Object({
        id: t.String(),
        name: t.String(),
        studentNo: t.Number(),
      }),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrenciyi Sınıftan Çıkar",
    description: "Öğrencinin sınıf bilgisini kaldırır (sınıfsız hale getirir)",
  },
} satisfies ControllerHook;

export const studentClassroomHistoryDto = {
  params: t.Object({
    studentId: StudentPlain.properties.id,
  }),
  response: {
    200: t.Array(
      t.Object({
        classId: t.String(),
        className: t.String(),
        transferDate: t.Date(),
        reason: t.Optional(t.String()),
      })
    ),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrencinin Sınıf Geçmişini Getir",
    description: "Öğrencinin hangi sınıflarda bulunduğu geçmişini gösterir",
  },
} satisfies ControllerHook;
