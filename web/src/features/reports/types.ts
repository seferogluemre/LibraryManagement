export interface TopStudent {
  id: string;
  name: string;
  studentNo: number;
  className: string;
  totalBooksRead: number;
  currentlyBorrowedBooks: number;
}

export interface TopBook {
  id: string;
  title: string;
  authorName: string;
  categoryName: string;
  totalTimesRead: number;
  currentlyAvailable: number;
  totalCopies: number;
}

export interface SystemStats {
  totalBooks: number;
  totalStudents: number;
  totalActiveAssignments: number;
  totalOverdueBooks: number;
  totalReturnedBooks: number;
}

export interface OverdueBook {
  assignmentId: string;
  studentId: string;
  studentName: string;
  className: string;
  bookTitle: string;
  authorName: string;
  assignedAt: string;
  returnDue: string;
  daysOverdue: number;
  assignedByName: string;
}

export interface ReportsResponse {
  topStudents: TopStudent[];
  topBooks: TopBook[];
  systemStats: SystemStats[];
  overdueBooks: OverdueBook[];
} 