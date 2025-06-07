import prisma from "@core/prisma";
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

      const teacherGroups = new Map<string, TeacherNotificationData>();

      for (const assignment of overdueAssignments) {
        const teacherId = assignment.assignedBy.id;
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

      for (const data of teacherGroups.values()) {
        try {
          await NotificationService.overdueNotification(data);

          await NotificationQueue.addOverdueBookEmail(data);
        } catch (error) {
          console.error(`❌ İşlem hatası (${data.teacherEmail}):`, error);
        }
      }
    } catch (error) {
      throw error;
    }
  });
}
