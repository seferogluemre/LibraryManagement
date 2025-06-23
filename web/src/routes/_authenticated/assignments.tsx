import { columns } from "@/components/columns/book-assignment-columns"
import { BookAssignmentDataTable } from "@/components/data-table/book-assignment-data-table"
import { AssignmentStats } from "@/features/assignments/components/assignment-stats"
import { AssignmentsToolbar } from "@/features/assignments/components/assignments-toolbar"
import { type BookAssignment } from "@/features/assignments/types"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/assignments")({
  component: AssignmentsPage,
})

// Mock Data
const assignments: BookAssignment[] = [
  {
    id: "1",
    bookName: "Suç ve Ceza",
    studentName: "Ahmet Yılmaz",
    className: "11-A",
    assignedDate: "2024-01-15",
    dueDate: "2024-02-15",
    status: "Ödünç Verildi",
    returnDate: null,
  },
  {
    id: "2",
    bookName: "Sefiller",
    studentName: "Can Öztürk",
    className: "10-B",
    assignedDate: "2023-12-20",
    dueDate: "2024-01-20",
    status: "Gecikmiş",
    returnDate: null,
  },
  {
    id: "3",
    bookName: "1984",
    studentName: "Zeynep Kaya",
    className: "12-A",
    assignedDate: "2024-01-10",
    dueDate: "2024-02-10",
    status: "Ödünç Verildi",
    returnDate: null,
  },
  {
    id: "4",
    bookName: "Simyacı",
    studentName: "Mehmet Demir",
    className: "11-C",
    assignedDate: "2024-01-05",
    dueDate: "2024-02-05",
    status: "İade Edildi",
    returnDate: "2024-02-01",
  },
]

function AssignmentsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Kitap Ödünç İşlemleri
          </h1>
          <p className="text-muted-foreground">
            Öğrencilere verilen kitapları yönetin
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <AssignmentsToolbar />
        <BookAssignmentDataTable columns={columns} data={assignments} />
        <AssignmentStats />
      </div>
    </div>
  )
} 