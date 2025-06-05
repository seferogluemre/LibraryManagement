import redis from "#core/redis";
import { sendOverdueBookEmail } from "#emails/overdue-book-email";
import { Worker } from "bullmq";
import { TeacherNotificationData } from "../types";

export const emailWorker = new Worker(
  "email-notifications",
  async (job) => {
    try {
      console.log("📨 Email gönderme işlemi başladı:", job.id);
      const data = job.data as TeacherNotificationData;

      console.log("📧 Email gönderiliyor:", {
        to: data.teacherEmail,
        studentCount: data.overdueStudents.length,
      });

      // Mail gönder
      await sendOverdueBookEmail(data);

      console.log(`✉️ Mail başarıyla gönderildi: ${data.teacherEmail}`);
    } catch (error) {
      console.error("❌ Mail gönderme hatası:", error);
      throw error;
    }
  },
  {
    connection: redis,
  }
);

// Error handler
emailWorker.on("failed", (job, err) => {
  console.error(`❌ Mail gönderme hatası (${job?.id}):`, err);
});
