import redis from "@core/redis";
import { Queue } from "bullmq";
import { TeacherNotificationData } from "../types";

export abstract class NotificationQueue {
  private static emailQueue = new Queue("email-notifications", {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  });

  static async addOverdueBookEmail(data: TeacherNotificationData) {
    return this.emailQueue.add("overdue-book-email", data);
  }
}
