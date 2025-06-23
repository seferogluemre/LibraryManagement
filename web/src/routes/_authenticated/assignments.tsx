import { columns } from "@/components/columns/book-assignment-columns";
import { BookAssignmentDataTable } from "@/components/data-table/book-assignment-data-table";
import { AssignmentStats } from "@/features/assignments/components/assignment-stats";
import { AssignmentsToolbar } from "@/features/assignments/components/assignments-toolbar";
import { type BookAssignment } from "@/features/assignments/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/assignments")({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await api["book-assignments"].get();
      if (res.error) {
        throw new Error("Veri çekilemedi");
      }
      return res.data;
    },
  });

  const formattedData: BookAssignment[] = useMemo(() => {
    if (!data) return [];
    return data.map((item: any) => {
      const isOverdue = !item.returned && new Date(item.returnDue) < new Date();
      let status: "Ödünç Verildi" | "Gecikmiş" | "İade Edildi" = "Ödünç Verildi";
      if (item.returned) {
        status = "İade Edildi";
      } else if (isOverdue) {
        status = "Gecikmiş";
      }

      return {
        id: item.id,
        bookName: item.book.title,
        studentName: item.student.name,
        className: item.student.classroom?.name || "N/A",
        assignedDate: new Date(item.createdAt).toLocaleDateString(),
        dueDate: new Date(item.returnDue).toLocaleDateString(),
        returnDate: item.returnedAt
          ? new Date(item.returnedAt).toLocaleDateString()
          : null,
        status: status,
      };
    });
  }, [data]);

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
        <BookAssignmentDataTable
          columns={columns}
          data={formattedData}
          isLoading={isLoading}
        />
        <AssignmentStats data={formattedData} />
      </div>
    </div>
  );
}
