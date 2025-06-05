import prisma from "#core/prisma";
import { schedule } from "node-cron";
import { NotificationQueue } from "../queues/notification.queue";
import { NotificationService } from "../service";
import { TeacherNotificationData } from "../types";

// Her dakika çalışacak (test için)
const cronSchedule = "* * * * *";

// Normale döndürmek için:
// const cronSchedule = "0 9,16 * * *";

export function startOverdueBooksCron() {
  schedule(cronSchedule, async () => {
    try {
      console.log("🔍 Gecikmiş kitaplar kontrol ediliyor...");

      // 1. Geciken kitapları bul
      const overdueAssignments = await prisma.bookAssignment.findMany({
        where: {
          returned: false,
          returnDue: { lt: new Date() },
        },
        include: {
          student: {
            select: { id: true, name: true },
          },
          book: {
            select: { title: true },
          },
          assignedBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      console.log(
        `📚 Bulunan gecikmiş kitap sayısı: ${overdueAssignments.length}`
      );

      // 2. Öğretmenlere göre grupla
      const teacherGroups = new Map<string, TeacherNotificationData>();

      for (const assignment of overdueAssignments) {
        const teacherId = assignment.assignedBy.id;
        console.log(`👩‍🏫 Öğretmen bilgileri:`, {
          id: teacherId,
          name: assignment.assignedBy.name,
          email: assignment.assignedBy.email,
        });

        if (!teacherGroups.has(teacherId)) {
          teacherGroups.set(teacherId, {
            teacherId,
            teacherName: assignment.assignedBy.name,
            teacherEmail: assignment.assignedBy.email,
            overdueStudents: [],
          });
        }

        const group = teacherGroups.get(teacherId)!;
        group.overdueStudents.push({
          studentId: assignment.student.id,
          studentName: assignment.student.name,
          bookTitle: assignment.book.title,
          daysOverdue: Math.floor(
            (Date.now() - assignment.returnDue.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
        });
      }

      console.log(
        `👥 Bildirim gönderilecek öğretmen sayısı: ${teacherGroups.size}`
      );

      // 3. Her öğretmen için bildirim oluştur ve mail gönder
      for (const data of teacherGroups.values()) {
        console.log(`📧 Mail kuyruğa ekleniyor:`, {
          teacherName: data.teacherName,
          teacherEmail: data.teacherEmail,
          studentCount: data.overdueStudents.length,
        });

        try {
          // Bildirim oluştur
          await NotificationService.overdueNotification(data);

          // Mail kuyruğuna ekle
          await NotificationQueue.addOverdueBookEmail(data);
        } catch (error) {
          console.error(`❌ İşlem hatası (${data.teacherEmail}):`, error);
        }
      }

      console.log("✅ Geciken kitap kontrolleri tamamlandı");
    } catch (error) {
      console.error("❌ Cron job hatası:", error);
    }
  });
}
