import redis from "@core/redis";
import { sendOverdueBookEmail } from "@emails/overdue-book-email";
import { Worker } from "bullmq";
import { TeacherNotificationData } from "../types";

export const emailWorker = new Worker(
  "email-notifications",
  async (job) => {
    try {
      const data = job.data as TeacherNotificationData;

      await sendOverdueBookEmail(data);
    } catch (error) {
      throw error;
    }
  },
  {
    connection: redis,
  }
);

emailWorker.on("failed", (job, err) => {
  throw err;
});
