import { t } from "elysia";

import { StudentPlain } from "@prisma/prismabox/Student";
import { ControllerHook, errorResponseDto } from "@utils/elysia-types";

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
      })
    ),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrencinin Transfer Geçmişi",
    description: "Öğrencinin sınıf değişiklik geçmişini gösterir",
  },
} satisfies ControllerHook;

// Additional DTOs for special endpoints
export const studentClassroomBulkTransferDto = {
  body: t.Object({
    studentIds: t.Array(t.String(), {
      description: "Transfer edilecek öğrenci ID'leri",
    }),
    newClassId: t.String({
      description: "Yeni sınıf ID'si",
    }),
    reason: t.Optional(
      t.String({
        description: "Transfer sebebi",
      })
    ),
  }),
  response: {
    200: t.Object({
      summary: t.Object({
        total: t.Number(),
        successful: t.Number(),
        failed: t.Number(),
      }),
      details: t.Object({
        successful: t.Array(t.String()),
        failed: t.Array(
          t.Object({
            studentId: t.String(),
            error: t.String(),
          })
        ),
      }),
    }),
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Toplu Öğrenci Transferi",
    description: "Birden fazla öğrenciyi aynı anda başka sınıfa transfer eder",
  },
} satisfies ControllerHook;

export const studentClassroomClassCountDto = {
  params: t.Object({
    classId: t.String(),
  }),
  response: {
    200: t.Object({
      classId: t.String(),
      studentCount: t.Number(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Sınıf Öğrenci Sayısı",
    description: "Belirtilen sınıftaki öğrenci sayısını döner",
  },
} satisfies ControllerHook;
