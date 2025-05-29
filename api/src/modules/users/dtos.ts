import { Prisma, UserRole } from "@prisma/client";
import { t } from "elysia";

import { UserPlain } from "../../../prisma/prismabox/User";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";
import { passwordValidation } from "./field-validation";

const UserRoleEnum = t.Enum(UserRole);

export function getUserFilters(query?: {
  id?: string;
  email?: string;
  role?: UserRole;
}) {
  if (!query) {
    return [false, [], undefined] as const;
  }

  const filters: Prisma.UserWhereInput[] = [];
  const { id, email, role } = query;

  if (id) {
    filters.push({ id });
  }

  if (email) {
    filters.push({ email: { contains: email, mode: "insensitive" } });
  }

  if (role) {
    filters.push({ role });
  }

  return [filters.length > 0, filters, undefined] as const;
}

export const userResponseSchema = t.Object({
  id: UserPlain.properties.id,
  name: UserPlain.properties.name,
  email: UserPlain.properties.email,
  role: UserPlain.properties.role,
  createdAt: UserPlain.properties.createdAt,
});

export const userIndexDto = {
  query: t.Object({
    id: t.Optional(UserPlain.properties.id),
    email: t.Optional(t.String()),
    role: t.Optional(UserRoleEnum),
  }),
  response: { 200: t.Array(userResponseSchema) },
  detail: {
    summary: "Kullanıcıları Listele",
  },
} satisfies ControllerHook;

export const userShowDto = {
  params: t.Object({
    id: UserPlain.properties.id,
  }),
  response: {
    200: userResponseSchema,
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Tek Kullanıcıyı Göster",
  },
} satisfies ControllerHook;

export const userUpdateDto = {
  params: t.Object({
    id: UserPlain.properties.id,
  }),
  body: t.Object({
    name: t.Optional(UserPlain.properties.name),
    password: t.Optional(passwordValidation),
    role: t.Optional(UserRoleEnum),
  }),
  response: {
    200: userResponseSchema,
    404: errorResponseDto[404],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Kullanıcıyı Güncelle",
  },
} satisfies ControllerHook;

export const userDestroyDto = {
  params: t.Object({
    id: UserPlain.properties.id,
  }),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    404: errorResponseDto[404],
  },
  detail: {
    summary: "Kullanıcıyı Sil",
  },
} satisfies ControllerHook;

export const userCreateDto = {
  body: t.Object({
    name: UserPlain.properties.name,
    email: t.String({ format: "email", minLength: 3, maxLength: 255 }),
    password: passwordValidation,
    role: UserRoleEnum,
  }),
  response: {
    200: userResponseSchema,
    409: errorResponseDto[409],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Yeni Kullanıcı Oluştur",
  },
} satisfies ControllerHook;
export const userCreateResponseDto = userCreateDto.response["200"];
