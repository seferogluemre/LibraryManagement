import { t } from "elysia";
import { UserPlain } from "../../../prisma/prismabox/User";
import { ControllerHook, errorResponseDto } from "../../utils/elysia-types";

// Auth response schemas
export const authUserResponseSchema = t.Object({
  id: UserPlain.properties.id,
  name: UserPlain.properties.name,
  email: UserPlain.properties.email,
  role: UserPlain.properties.role,
  createdAt: UserPlain.properties.createdAt,
});

export const loginResponseSchema = t.Object({
  user: authUserResponseSchema,
  accessToken: t.String(),
  refreshToken: t.String(),
});

export const refreshTokenResponseSchema = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

// Auth DTOs
export const loginDto = {
  body: t.Object({
    email: t.String({
      format: "email",
      minLength: 3,
      maxLength: 255,
      description: "Kullanıcı email adresi",
    }),
    password: t.String({
      minLength: 6,
      maxLength: 100,
      description: "Kullanıcı şifresi",
    }),
  }),
  response: {
    200: loginResponseSchema,
    401: errorResponseDto[401],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Kullanıcı Girişi",
    description: "Email ve şifre ile kullanıcı girişi yapar, JWT token döner",
  },
} satisfies ControllerHook;

export const refreshTokenDto = {
  body: t.Object({
    refreshToken: t.String({
      description: "Geçerli refresh token",
    }),
  }),
  response: {
    200: refreshTokenResponseSchema,
    401: errorResponseDto[401],
    422: errorResponseDto[422],
  },
  detail: {
    summary: "Token Yenileme",
    description: "Refresh token ile yeni access token ve refresh token alır",
  },
} satisfies ControllerHook;

export const logoutDto = {
  body: t.Optional(
    t.Object({
      refreshToken: t.Optional(
        t.String({
          description: "Geçersiz kılınacak refresh token",
        })
      ),
    })
  ),
  response: {
    200: t.Object({
      message: t.String(),
    }),
    401: errorResponseDto[401],
  },
  detail: {
    summary: "Kullanıcı Çıkışı",
    description: "Kullanıcıyı çıkış yapar, token'ı geçersiz kılar",
  },
} satisfies ControllerHook;

export const meDto = {
  response: {
    200: authUserResponseSchema,
    401: errorResponseDto[401],
  },
  headers: t.Object({
    authorization: t.String({
      description: "Bearer {access_token}",
      pattern: "^Bearer .+$",
    }),
  }),
  detail: {
    summary: "Kullanıcı Profili",
    description: "Giriş yapmış kullanıcının profil bilgilerini döner",
  },
} satisfies ControllerHook;
