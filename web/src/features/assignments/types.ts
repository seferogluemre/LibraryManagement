export type BookAssignment = {
  id: string
  bookName: string
  studentName: string
  className: string
  assignedDate: string
  dueDate: string
  returnDate?: string | null
  status: 'Ödünç Verildi' | 'Gecikmiş' | 'İade Edildi'
} 