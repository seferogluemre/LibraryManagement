import { Prisma } from "@prisma/client";
import { AuthorPlain } from "@prismabox/Author";
import { BookPlain } from "@prismabox/Book";
import { ControllerHook, errorResponseDto } from "@utils/elysia-types";
import { t } from "elysia";

export function getAuthorFilters(query?: {
  id?: string;
  name?: string;
  email?: string;
  studentNo?: number;
  classId?: string;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.AuthorWhereInput[] = [];
  const { id, name, email, studentNo, classId } = query;

  if (id) {
    filters.push({ id });
  }

  if (name) {
    filters.push({ name: { contains: name, mode: "insensitive" } });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const authorResponseSchema = t.Object({
  id: AuthorPlain.properties.id,
  name: AuthorPlain.properties.name,
});

const authorWithCountResponseSchema = t.Object({
    id: AuthorPlain.properties.id,
    name: AuthorPlain.properties.name,
    _count: t.Object({
        books: t.Number()
    })
})

export const paginatedAuthorResponseSchema = t.Object({
  data: t.Array(authorWithCountResponseSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const authorWithBooksResponseSchema = t.Object({
  id: AuthorPlain.properties.id,
  name: AuthorPlain.properties.name,
  books: t.Array(BookPlain.properties.id),
});

export const authorIndexDto = {
  query: t.Object({
    page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
    limit: t.Optional(t.Numeric({ default: 10, minimum: 1 })),
    name: t.Optional(t.String()),
  }),
  response: {
    200: paginatedAuthorResponseSchema,
  },
  detail: {
    summary: "Yazarları Listele",
  },
} satisfies ControllerHook;

export const authorShowDto = {
  params: t.Object({
    id: AuthorPlain.properties.id,
  }),
  response: {
    200: authorResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Yazarı Göster",
  },
} satisfies ControllerHook;

export const authorUpdateDto = {
  params: t.Object({
    id: AuthorPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(AuthorPlain.properties.name),
  }),
  response: {
    200: authorResponseSchema,
    404: errorResponseDto[404],
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yazarı Güncelle",
  },
} satisfies ControllerHook;

export const authorDestroyDto = {
  params: t.Object({
    id: AuthorPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Yazarı Sil",
  },
} satisfies ControllerHook;

export const authorCreateDto = {
  body: t.Object({
    name: AuthorPlain.properties.name,
  }),
  response: {
    200: authorResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Yazar Oluştur",
  },
} satisfies ControllerHook;

export const authorCreateResponseDto = authorCreateDto.response["200"];
