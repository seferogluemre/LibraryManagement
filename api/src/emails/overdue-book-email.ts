import { TeacherNotificationData } from "@modules/notifications";
import { createTransport } from "nodemailer";

export async function sendOverdueBookEmail(data: TeacherNotificationData) {
  const transport = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const studentListHTML = data.overdueStudents
    .map(
      (student) =>
        `<li style="margin-bottom: 12px; font-size: 16px; color: #555555; border-left: 3px solid #d9534f; padding-left: 15px;">
          <strong>${student.studentName}:</strong> "${student.bookTitle}" kitabını
          <strong style="color: #d9534f; font-weight: bold;">${student.daysOverdue}</strong> gündür teslim etmedi.
         </li>`
    )
    .join("");

  const html = `
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
          <h1 style="color: #2c3e50; font-size: 28px; margin: 0;">Ümmü Mihcen Kütüphanesi</h1>
          <h2 style="color: #7f8c8d; font-size: 22px; font-weight: 400; margin-top: 5px;">Geciken Kitap Bildirimi</h2>
        </div>
        <div style="padding: 25px 0;">
          <p style="font-size: 18px; color: #34495e; margin-bottom: 20px;">Merhaba Sayın ${data.teacherName},</p>
          <p style="font-size: 16px; color: #555555; line-height: 1.6;">
            Sorumluluğunuzda bulunan ve aşağıda listelenen öğrencilerin, belirtilen kitapları zamanında teslim etmedikleri tespit edilmiştir:
          </p>
          <ul style="list-style-type: none; padding: 0; margin-top: 25px;">
            ${studentListHTML}
          </ul>
          <p style="font-size: 16px; color: #555555; line-height: 1.6; margin-top: 25px;">
            Öğrencilerle iletişime geçerek kitapların en kısa sürede iade edilmesini sağlamanızı önemle rica ederiz.
          </p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; font-size: 12px; color: #999999;">
          <p>Bu, sistem tarafından gönderilen otomatik bir bildirimdir.</p>
          <p style="margin-top: 5px;">&copy; ${new Date().getFullYear()} Ümmü Mihcen Kütüphane Yönetim Sistemi</p>
        </div>
      </div>
    </body>
  `;

  const fromAddress = `"Ümmü Mihcen Kütüphane Yönetim" <${process.env.SMTP_FROM}>`;

  try {
    await transport.sendMail({
      from: fromAddress,
      to: data.teacherEmail,
      subject: "Geciken Kitap Bildirimi",
      html: html,
    });
  } catch (error) {
    throw error;
  }
}
