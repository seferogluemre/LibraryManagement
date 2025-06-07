import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { ClassroomPlain } from "@prismabox/Classroom";
import { ControllerHook, errorResponseDto } from "@utils/elysia-types";

export function getClassroomFilters(query?: { id?: string; name?: string }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.ClassroomWhereInput[] = [];
  const { id, name } = query;

  if (id) {
    filters.push({ id });
  }

  if (name) {
    filters.push({ name: { contains: name, mode: "insensitive" } });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const classroomResponseSchema = t.Object({
  id: ClassroomPlain.properties.id,
  name: ClassroomPlain.properties.name,
});

export const classroomWithStudentsResponseSchema = t.Object({
  id: ClassroomPlain.properties.id,
  name: ClassroomPlain.properties.name,
  createdAt: ClassroomPlain.properties.createdAt,
  students: t.Array(
    t.Object({
      id: t.String(),
      name: t.String(),
      email: t.Optional(t.String()),
      studentNo: t.Number(),
    })
  ),
});

export const classroomIndexDto = {
  query: t.Object({
    id: t.Optional(ClassroomPlain.properties.id),
    name: t.Optional(t.String()),
  }),
  response: { 200: t.Array(classroomWithStudentsResponseSchema) },
  detail: {
    summary: "Sınıfları Listele",
    description: "Tüm sınıfları ve her sınıfa ait öğrencileri listeler",
  },
} satisfies ControllerHook;

export const classroomShowDto = {
  params: t.Object({
    id: ClassroomPlain.properties.id,
  }),
  response: {
    200: classroomWithStudentsResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Sınıfı Göster",
    description: "Belirtilen sınıfı ve sınıfa ait öğrencileri gösterir",
  },
} satisfies ControllerHook;

export const classroomUpdateDto = {
  params: t.Object({
    id: ClassroomPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(ClassroomPlain.properties.name),
  }),
  response: {
    200: classroomResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Sınıfı Güncelle",
  },
} satisfies ControllerHook;

export const classroomDestroyDto = {
  params: t.Object({
    id: ClassroomPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Sınıfı Sil",
  },
} satisfies ControllerHook;

export const classroomCreateDto = {
  body: t.Object({
    name: ClassroomPlain.properties.name,
  }),
  response: {
    200: classroomResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Sınıf Oluştur",
  },
} satisfies ControllerHook;
export const classroomCreateResponseDto = classroomCreateDto.response["200"];
