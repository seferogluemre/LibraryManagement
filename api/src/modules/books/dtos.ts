import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { BookPlain } from "@prisma/prismabox/Book";
import { ControllerHook, errorResponseDto } from "@utils/elysia-types";

export function getBooksFilters(query?: {
  id?: string;
  title?: string;
  isbn?: string;
  authorId?: string;
  categoryId?: string;
  publisherId?: string;
  publishedYear?: number;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.BookWhereInput[] = [];
  const { id, title, isbn, authorId, categoryId, publisherId, publishedYear } =
    query;

  if (id) {
    filters.push({ id });
  }

  if (title) {
    filters.push({ title: { contains: title, mode: "insensitive" } });
  }

  if (isbn) {
    filters.push({ isbn: { contains: isbn, mode: "insensitive" } });
  }

  if (authorId) {
    filters.push({ authorId });
  }

  if (categoryId) {
    filters.push({ categoryId });
  }

  if (publisherId) {
    filters.push({ publisherId });
  }

  if (publishedYear) {
    filters.push({ publishedYear });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const bookResponseSchema = t.Object({
  id: BookPlain.properties.id,
  title: BookPlain.properties.title,
  isbn: BookPlain.properties.isbn,
  publishedYear: BookPlain.properties.publishedYear,
  totalCopies: BookPlain.properties.totalCopies,
  availableCopies: BookPlain.properties.availableCopies,
  authorId: BookPlain.properties.authorId,
  categoryId: BookPlain.properties.categoryId,
  publisherId: BookPlain.properties.publisherId,
  addedById: BookPlain.properties.addedById,
});

export const bookWithRelationsResponseSchema = t.Object({
  id: BookPlain.properties.id,
  title: BookPlain.properties.title,
  isbn: BookPlain.properties.isbn,
  publishedYear: BookPlain.properties.publishedYear,
  totalCopies: BookPlain.properties.totalCopies,
  availableCopies: BookPlain.properties.availableCopies,
  authorId: BookPlain.properties.authorId,
  categoryId: BookPlain.properties.categoryId,
  publisherId: BookPlain.properties.publisherId,
  addedById: BookPlain.properties.addedById,
  author: t.Object({
    id: t.String(),
    name: t.String(),
  }),
  category: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
    t.Null(),
  ]),
  publisher: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
    }),
    t.Null(),
  ]),
});

export const bookIndexDto = {
  query: t.Object({
    id: t.Optional(BookPlain.properties.id),
    title: t.Optional(t.String()),
    isbn: t.Optional(t.String()),
    authorId: t.Optional(t.String()),
    categoryId: t.Optional(t.String()),
    publisherId: t.Optional(t.String()),
    publishedYear: t.Optional(t.Number()),
  }),
  response: { 200: t.Array(bookWithRelationsResponseSchema) },
  detail: {
    summary: "Kitapları Listele",
  },
} satisfies ControllerHook;

export const bookShowDto = {
  params: t.Object({
    id: BookPlain.properties.id,
  }),
  response: {
    200: bookWithRelationsResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Kitabı Göster",
  },
} satisfies ControllerHook;

export const bookUpdateDto = {
  params: t.Object({
    id: BookPlain.properties.id,
  }),
  body: t.Object({
    title: t.Optional(t.String()),
    isbn: t.Optional(t.Union([t.String(), t.Null()])),
    publishedYear: t.Optional(t.Union([t.Number(), t.Null()])),
    totalCopies: t.Optional(t.Number({ minimum: 0 })),
    availableCopies: t.Optional(t.Number({ minimum: 0 })),
    authorId: t.Optional(t.String()),
    categoryId: t.Optional(t.Union([t.String(), t.Null()])),
    publisherId: t.Optional(t.Union([t.String(), t.Null()])),
    addedBy: t.Optional(t.String()),
  }),
  response: {
    200: bookWithRelationsResponseSchema,
    404: errorResponseDto[404],
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Kitabı Güncelle",
  },
} satisfies ControllerHook;

export const bookDestroyDto = {
  params: t.Object({
    id: BookPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kitabı Sil",
  },
} satisfies ControllerHook;

export const bookCreateDto = {
  body: t.Object({
    title: t.String(),
    author_id: t.String(),
    publisher_id: t.String(),
    category_id: t.Optional(t.String()),
    published_year: t.Number(),
    isbn: t.String(),
    total_copies: t.Number(),
    available_copies: t.Number(),
    description: t.Optional(t.String()),
    shelf_location: t.Optional(t.String()),
  }),
  response: {
    201: bookResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Kitap Oluştur",
  },
} satisfies ControllerHook;

export const bookCreateResponseDto = bookCreateDto.response["201"];

// Additional DTOs for special endpoints
export const booksByAuthorDto = {
  params: t.Object({
    authorId: t.String(),
  }),
  response: {
    200: t.Array(bookWithRelationsResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Yazara Göre Kitapları Listele",
    description: "Belirli bir yazarın tüm kitaplarını listeler",
  },
} satisfies ControllerHook;

export const booksByCategoryDto = {
  params: t.Object({
    categoryId: t.String(),
  }),
  response: {
    200: t.Array(bookWithRelationsResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kategoriye Göre Kitapları Listele",
    description: "Belirli bir kategorideki tüm kitapları listeler",
  },
} satisfies ControllerHook;

export const booksByPublisherDto = {
  params: t.Object({
    publisherId: t.String(),
  }),
  response: {
    200: t.Array(bookWithRelationsResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Yayınevine Göre Kitapları Listele",
    description: "Belirli bir yayınevinin tüm kitaplarını listeler",
  },
} satisfies ControllerHook;

export const bookByIsbnDto = {
  params: t.Object({
    isbn: t.String(),
  }),
  response: {
    200: bookWithRelationsResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "ISBN'e Göre Kitap Bul",
    description: "ISBN numarası ile kitap arar",
  },
} satisfies ControllerHook;
