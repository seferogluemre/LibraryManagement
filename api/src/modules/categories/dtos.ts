import { Prisma } from "@prisma/client";
import { BookPlain } from "@prismabox/Book";
import { CategoryPlain } from "@prismabox/Category";
import { ControllerHook, errorResponseDto } from "@utils/elysia-types";
import { t } from "elysia";

export function getCategoryFilters(query?: { id?: string; name?: string }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.CategoryWhereInput[] = [];
  const { id, name } = query;

  if (id) {
    filters.push({ id });
  }

  if (name) {
    filters.push({ name: { contains: name, mode: "insensitive" } });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const categoryResponseSchema = t.Object({
  id: CategoryPlain.properties.id,
  name: CategoryPlain.properties.name,
  books: t.Array(t.Object({
    id: BookPlain.properties.id,
    title: BookPlain.properties.title,
  })),
});

export const paginatedCategoryResponseSchema = t.Object({
  data: t.Array(categoryResponseSchema),
  total: t.Number(),
  page: t.Number(),
  limit: t.Number(),
});

export const categoryWithBooksResponseSchema = t.Object({
  id: CategoryPlain.properties.id,
  name: CategoryPlain.properties.name,
  books: t.Array(BookPlain.properties.id),
});

export const categoryIndexDto = {
  query: t.Object({
    page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
    limit: t.Optional(t.Numeric({ default: 10, minimum: 1 })),
    name: t.Optional(t.String()),
  }),
  response: { 200: paginatedCategoryResponseSchema },
  detail: {
    summary: "Kategorileri Listele",
  },
} satisfies ControllerHook;

export const categoryShowDto = {
  params: t.Object({
    id: CategoryPlain.properties.id,
  }),
  response: {
    200: categoryResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Kategori Göster",
  },
} satisfies ControllerHook;

export const categoryUpdateDto = {
  params: t.Object({
    id: CategoryPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(CategoryPlain.properties.name),
  }),
  response: {
    200: categoryResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Kategoriyi Güncelle",
  },
} satisfies ControllerHook;




export const categoryDestroyDto = {
  params: t.Object({
    id: CategoryPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kategoriyi Sil",
  },
} satisfies ControllerHook;

export const categoryCreateDto = {
  body: t.Object({
    name: CategoryPlain.properties.name,
  }),
  response: {
    200: categoryResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Kategori Oluştur",
  },
} satisfies ControllerHook;

export const categoryCreateResponseDto = categoryCreateDto.response["200"];
