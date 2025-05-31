import { t } from "elysia";

// ElysiaJS ControllerHook tipi - gerekli parametreleri basitleştirildi
export type ControllerHook = any; // Şimdilik basit tanım, daha sonra düzeltilebilir

export type ExtractBody<T> = T extends { body: infer B } ? B : unknown;

// Standart HTTP hata yanıtları için DTO'lar
export const errorResponseDto = {
  400: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
  }),
  401: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
  }),
  404: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
  }),
  409: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
  }),
  422: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
    details: t.Optional(
      t.Array(
        t.Object({
          field: t.String(),
          message: t.String(),
        })
      )
    ),
  }),
  500: t.Object({
    message: t.String(),
    error: t.Optional(t.String()),
  }),
} as const;
