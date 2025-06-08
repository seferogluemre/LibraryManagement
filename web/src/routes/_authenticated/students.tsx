import { columns } from '@/components/columns/student-columns'
import { DataTable } from '@/components/ui/data-table'
import { AddStudentForm } from '@/features/students/components/AddStudentForm'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated/students')({
  component: StudentManagementPage,
})

function StudentManagementPage() {
  const { data: students, isLoading, isError, error } = useQuery({
    queryKey: ['students'],
    queryFn: () => api.students.get(),
  })

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }
  if (isError) {
    return <div>Hata: {error.message}</div>
  }

  if (!students) {
    return <div>Öğrenci verisi bulunamadı.</div>
  }


  return (
    <div className="p-4 md:p-6">
      {/* Sayfa Başlığı ve Yeni Öğrenci Ekle Butonu */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Öğrenciler</h1>
          <p className="text-muted-foreground">
            Okuldaki tüm öğrencileri yönetin
          </p>
        </div>
        <AddStudentForm />
      </div>

      {/* DataTable Bileşenini Kullanımı */}
      <DataTable columns={columns} data={students.data} searchKey="name" />
    </div>
  )
}
