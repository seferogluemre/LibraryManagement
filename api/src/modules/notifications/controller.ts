import Elysia from "elysia";
import { markAsReadDto, notificationIndexDto } from "./dtos";
import { NotificationFormatters } from "./formatters";
import { NotificationService } from "./service";

export const app = new Elysia({
  prefix: "/notifications",
  tags: ["Notifications"],
  name: "Notifications",
})
  .get(
    "/",
    async ({ query, user }) => {
      const notifications = await NotificationService.list(user.id, {
        isRead: query.isRead,
        type: query.type,
      });
      return notifications?.map(
        NotificationFormatters.formatNotificationResponse
      );
    },
    notificationIndexDto
  )

  .patch(
    "/notifications/:id/isRead",
    async ({ params, user }) => {
      return NotificationService.markAsRead(params.id, user.id);
    },
    markAsReadDto
  );
