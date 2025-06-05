import { Notification } from "@prisma/client";

export abstract class NotificationFormatters {
    static formatNotificationResponse(notification: Notification) {
        return {
            id: notification.id,
            type: notification.type,
            message: notification.message,
            isRead: notification.isRead,
            metadata: notification.metadata,
            createdAt: notification.createdAt,
            formattedMessage: this.formatMessage(notification),
        };
    }

    static formatMessage(notification: Notification): string {
        switch (notification.type) {
            case "OVERDUE_BOOK":
                const { students } = notification.metadata as { students: any[] };
                return `${students.length} öğrencinizin kitap teslim tarihi geçti.`;
            default:
                return notification.message;
        }
    }
}
