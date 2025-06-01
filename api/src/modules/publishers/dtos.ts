import { Prisma } from "@prisma/client";
import { t } from "elysia";

import { BookPlain } from "@prismabox/Book";
import { PublisherPlain } from "@prismabox/Publisher";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

export function getPublisherFilters(query?: { id?: string; name?: string }) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.PublisherWhereInput[] = [];
  const { id, name } = query;

  if (id) {
    filters.push({ id });
  }

  if (name) {
    filters.push({ name: { contains: name, mode: "insensitive" } });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const publisherResponseSchema = t.Object({
  id: PublisherPlain.properties.id,
  name: PublisherPlain.properties.name,
});

export const publisherWithBooksResponseSchema = t.Object({
  id: PublisherPlain.properties.id,
  name: PublisherPlain.properties.name,
  books: t.Array(BookPlain.properties.id),
});

export const publisherIndexDto = {
  query: t.Object({
    id: t.Optional(PublisherPlain.properties.id),
    name: t.Optional(t.String()),
  }),
  response: { 200: t.Array(publisherWithBooksResponseSchema) },
  detail: {
    summary: "Yayıncıları Listele",
  },
} satisfies ControllerHook;

export const publisherShowDto = {
  params: t.Object({
    id: PublisherPlain.properties.id,
  }),
  response: {
    200: publisherWithBooksResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Yayıncıyı Göster",
  },
} satisfies ControllerHook;

export const publisherUpdateDto = {
  params: t.Object({
    id: PublisherPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(PublisherPlain.properties.name),
  }),
  response: {
    200: publisherWithBooksResponseSchema,
    404: errorResponseDto[404],
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yayıncıyı Güncelle",
  },
} satisfies ControllerHook;

export const publisherDestroyDto = {
  params: t.Object({
    id: PublisherPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Yayıncıyı Sil",
  },
} satisfies ControllerHook;

export const publisherCreateDto = {
  body: t.Object({
    name: PublisherPlain.properties.name,
  }),
  response: {
    200: publisherResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Yayıncı Oluştur",
  },
} satisfies ControllerHook;

export const publisherCreateResponseDto = publisherCreateDto.response["200"];

// Additional DTOs for special endpoints
export const publisherByBooksDto = {
  params: t.Object({
    books: t.Array(BookPlain.properties.id),
  }),
  response: {
    200: t.Array(publisherWithBooksResponseSchema),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kitaplarına Göre Yayıncıları Listele",
    description: "Belirli bir kitaplarına ait tüm yayıncıları listeler",
  },
} satisfies ControllerHook;

export const publisherByBooksResponseDto = publisherByBooksDto.response["200"];

export const publisherByNameDto = {
  params: t.Object({
    name: t.String(),
  }),
  response: {
    200: publisherWithBooksResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Yayıncı Numarasına Göre Yayıncı Bul",
    description: "Yayıncı numarası ile yayıncı arar",
  },
} satisfies ControllerHook;
