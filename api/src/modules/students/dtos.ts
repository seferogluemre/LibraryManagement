import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { StudentPlain } from "../../../prisma/prismabox/Student";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

export function getStudentFilters(query?: {
  id?: string;
  name?: string;
  email?: string;
  studentNo?: number;
  classId?: string;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.StudentWhereInput[] = [];
  const { id, name, email, studentNo, classId } = query;

  if (id) {
    filters.push({ id });
  }

  if (name) {
    filters.push({ name: { contains: name, mode: "insensitive" } });
  }

  if (email) {
    filters.push({ email: { contains: email, mode: "insensitive" } });
  }

  if (studentNo) {
    filters.push({ studentNo });
  }

  if (classId) {
    filters.push({ classId });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const studentResponseSchema = t.Object({
  id: StudentPlain.properties.id,
  name: StudentPlain.properties.name,
  email: t.Optional(StudentPlain.properties.email),
  studentNo: StudentPlain.properties.studentNo,
  classId: StudentPlain.properties.classId,
});

export const studentWithClassResponseSchema = t.Object({
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

export const studentIndexDto = {
  query: t.Object({
    id: t.Optional(StudentPlain.properties.id),
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    studentNo: t.Optional(t.Number()),
    classId: t.Optional(t.String()),
  }),
  response: { 200: t.Array(studentWithClassResponseSchema) },
  detail: {
    summary: "Öğrencileri Listele",
  },
} satisfies ControllerHook;

export const studentShowDto = {
  params: t.Object({
    id: StudentPlain.properties.id,
  }),
  response: {
    200: studentWithClassResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Öğrenciyi Göster",
  },
} satisfies ControllerHook;

export const studentUpdateDto = {
  params: t.Object({
    id: StudentPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(StudentPlain.properties.name),
    email: t.Optional(t.String()),
    studentNo: t.Optional(t.Number()),
    classId: t.Optional(t.String()),
  }),
  response: {
    200: studentWithClassResponseSchema,
    404: errorResponseDto[404],
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Öğrenciyi Güncelle",
  },
} satisfies ControllerHook;

export const studentDestroyDto = {
  params: t.Object({
    id: StudentPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrenciyi Sil",
  },
} satisfies ControllerHook;

export const studentCreateDto = {
  body: t.Object({
    name: StudentPlain.properties.name,
    email: t.Optional(t.String()),
    studentNo: t.Number({ minimum: 1 }),
    classId: t.String(),
  }),
  response: {
    200: studentWithClassResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Öğrenci Oluştur",
  },
} satisfies ControllerHook;

export const studentCreateResponseDto = studentCreateDto.response["200"];

// Additional DTOs for special endpoints
export const studentByClassDto = {
  params: t.Object({
    classId: t.String(),
  }),
  response: {
    200: t.Array(studentWithClassResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Sınıfa Göre Öğrencileri Listele",
    description: "Belirli bir sınıftaki tüm öğrencileri listeler",
  },
} satisfies ControllerHook;

export const studentByStudentNoDto = {
  params: t.Object({
    studentNo: t.String(),
  }),
  response: {
    200: studentWithClassResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Öğrenci Numarasına Göre Öğrenci Bul",
    description: "Öğrenci numarası ile öğrenci arar",
  },
} satisfies ControllerHook;
