import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { BookAssignmentPlain } from "@prismabox/BookAssignment";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

export function getBookAssignmentsFilters(query?: {
  id?: string;
  studentId?: string;
  bookId?: string;
  assignedById?: string;
  returnDue?: Date;
  returned?: boolean;
  returnedAt?: Date;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.BookAssignmentWhereInput[] = [];
  const { id, studentId, bookId, assignedById, returned } = query;

  if (id) {
    filters.push({ id });
  }

  if (studentId) {
    filters.push({ studentId });
  }

  if (bookId) {
    filters.push({ bookId });
  }

  if (assignedById) {
    filters.push({ assignedById });
  }

  if (returned !== undefined) {
    filters.push({ returned });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const bookAssignmentResponseSchema = t.Object({
  id: BookAssignmentPlain.properties.id,
  studentId: BookAssignmentPlain.properties.studentId,
  bookId: BookAssignmentPlain.properties.bookId,
  assignedById: BookAssignmentPlain.properties.assignedById,
  returnDue: BookAssignmentPlain.properties.returnDue,
  returned: BookAssignmentPlain.properties.returned,
  returnedAt: BookAssignmentPlain.properties.returnedAt,
});

export const bookAssignmentWithRelationsResponseSchema = t.Object({
  id: BookAssignmentPlain.properties.id,
  studentId: BookAssignmentPlain.properties.studentId,
  bookId: BookAssignmentPlain.properties.bookId,
  assignedById: BookAssignmentPlain.properties.assignedById,
  returnDue: BookAssignmentPlain.properties.returnDue,
  returned: BookAssignmentPlain.properties.returned,
  returnedAt: BookAssignmentPlain.properties.returnedAt,
  student: t.Object({
    id: t.String(),
    name: t.String(),
  }),
  book: t.Object({
    id: t.String(),
    title: t.String(),
  }),
  assignedBy: t.Object({
    id: t.String(),
    name: t.String(),
  }),
  publisher: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
    t.Null(),
  ]),
});

export const bookAssignmentIndexDto = {
  query: t.Object({
    id: t.Optional(BookAssignmentPlain.properties.id),
    studentId: t.Optional(BookAssignmentPlain.properties.studentId),
    bookId: t.Optional(BookAssignmentPlain.properties.bookId),
    assignedById: t.Optional(BookAssignmentPlain.properties.assignedById),
    returned: t.Optional(BookAssignmentPlain.properties.returned),
  }),
  response: { 200: t.Array(bookAssignmentWithRelationsResponseSchema) },
  detail: {
    summary: "Kitap Atamalarını Listele",
  },
} satisfies ControllerHook;

export const bookAssignmentShowDto = {
  params: t.Object({
    id: BookAssignmentPlain.properties.id,
  }),
  response: {
    200: bookAssignmentWithRelationsResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Kitap Atamasını Göster",
  },
} satisfies ControllerHook;

export const bookAssignmentUpdateDto = {
  params: t.Object({
    id: BookAssignmentPlain.properties.id,
  }),
  body: t.Object({
    return_due: t.Optional(BookAssignmentPlain.properties.returnDue),
  }),
  response: {
    200: bookAssignmentWithRelationsResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Kitap Atamasını Güncelle",
  },
} satisfies ControllerHook;

export const bookAssignmentDestroyDto = {
  params: t.Object({
    id: BookAssignmentPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kitap Atamasını Sil",
  },
} satisfies ControllerHook;

export const bookAssignmentCreateDto = {
  body: t.Object({
    student_id: BookAssignmentPlain.properties.studentId,
    book_id: BookAssignmentPlain.properties.bookId,
    return_due: BookAssignmentPlain.properties.returnDue,
  }),
  headers: t.Object({
    authorization: t.String({
      description: "Bearer {access_token}",
      pattern: "^Bearer .+$",
    }),
  }),
  response: {
    200: bookAssignmentWithRelationsResponseSchema,
    401: errorResponseDto[401],
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Kitap Ataması Oluştur",
    description:
      "Yeni kitap ataması oluşturur. Sisteme giriş yapmış kullanıcının bilgisi otomatik olarak assignedById alanına eklenir.",
  },
} satisfies ControllerHook;

export const bookAssignmentCreateResponseDto =
  bookAssignmentCreateDto.response["200"];

export const bookAssignmentOverdueDto = {
  response: { 200: t.Array(bookAssignmentWithRelationsResponseSchema) },
  detail: {
    summary: "Süresi Geçmiş Kitap Atamalarını Listele",
    description: "Teslim tarihi geçmiş olan aktif kitap atamalarını listeler",
  },
} satisfies ControllerHook;

export const bookAssignmentStudentActiveDto = {
  params: t.Object({
    studentId: t.String(),
  }),
  response: { 200: t.Array(bookAssignmentWithRelationsResponseSchema) },
  detail: {
    summary: "Öğrencinin Aktif Kitap Atamalarını Listele",
    description:
      "Belirli bir öğrencinin henüz iade etmediği kitap atamalarını listeler",
  },
} satisfies ControllerHook;

export const bookAssignmentReturnDto = {
  params: t.Object({
    id: BookAssignmentPlain.properties.id,
  }),
  response: {
    200: bookAssignmentWithRelationsResponseSchema,
    404: errorResponseDto[404],
    409: errorResponseDto[409],
  },
  detail: {
    summary: "Kitap İade Et",
    description: "Atanmış bir kitabı iade eder ve stoku günceller",
  },
} satisfies ControllerHook;
