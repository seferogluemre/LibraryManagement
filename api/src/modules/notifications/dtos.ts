import { NotificationType } from "@prisma/client";
import { t } from "elysia";

export const notificationSchema = t.Object({
  id: t.String(),
  type: t.Enum(NotificationType),
  message: t.String(),
  isRead: t.Boolean(),
  metadata: t.Optional(t.Any()),
  createdAt: t.Date(),
});

export const notificationIndexDto = {
  query: t.Object({
    isRead: t.Optional(t.Boolean()),
    type: t.Optional(t.Enum(NotificationType)),
  }),
  response: {
    200: t.Array(notificationSchema),
  },
  detail: {
    summary: "Bildirimleri Listele",
    description: "Kullanıcıya ait bildirimleri listeler",
  },
};

export const markAsReadDto = {
  params: t.Object({
    id: t.String(),
  }),
  response: {
    200: notificationSchema,
    404: t.Object({
      message: t.String(),
      code: t.String(),
    }),
  },
  detail: {
    summary: "Bildirimi Okundu İşaretle",
  },
};
