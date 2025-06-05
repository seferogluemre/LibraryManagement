export interface OverdueStudentInfo {
  studentId: string;
  studentName: string;
  bookTitle: string;
  daysOverdue: number;
}

export interface TeacherNotificationData {
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  overdueStudents: OverdueStudentInfo[];
}
