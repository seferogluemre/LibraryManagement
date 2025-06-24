import { columns } from "@/components/columns/book-assignment-columns";
import { BookAssignmentDataTable } from "@/components/data-table/book-assignment-data-table";
import { AssignmentStats } from "@/features/assignments/components/assignment-stats";
import { AssignmentsToolbar } from "@/features/assignments/components/assignments-toolbar";
import { type BookAssignment } from "@/features/assignments/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

type Student = {
  id: string;
  name: string;
};

type Book = {
  id: string;
  title: string;
};

type AssignmentApiResponse = {
  id: string;
  returned: boolean;
  returnDue: string;
  returnedAt: string | null;
  assignedAt: string;
  student: Student;
  book: Book;
  class: { name: string } | null;
};

export const Route = createFileRoute("/_authenticated/assignments")({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const [search, setSearch] = useState("");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["assignments", debouncedSearch, showOverdueOnly],
    queryFn: async () => {
      const res = await api["book-assignments"].get({
        query: {
          search: debouncedSearch,
          overdueOnly: showOverdueOnly,
        },
      });
      if (res.error) {
        throw new Error("Veri çekilemedi");
      }
      return res.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ["assignments-stats"],
    queryFn: async () => {
      const res = await api["book-assignments"].get();
      if (res.error) {
        console.error("İstatistik verisi çekilemedi:", res.error);
        return [];
      }
      return res.data;
    },
  });

  const formattedData: BookAssignment[] = useMemo(() => {
    if (!data) return [];
    return data.map((item: AssignmentApiResponse) => {
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
        className: item.class?.name || "N/A",
        assignedDate: new Date(item.assignedAt).toLocaleDateString(),
        dueDate: new Date(item.returnDue).toLocaleDateString(),
        returnDate: item.returnedAt
          ? new Date(item.returnedAt).toLocaleDateString()
          : null,
        status: status,
      };
    });
  }, [data]);

  const stats = useMemo(() => {
    if (!statsData) {
      return { active: 0, overdue: 0, returnedThisMonth: 0 };
    }

    const active = statsData.filter((item: AssignmentApiResponse) => !item.returned).length;

    const overdue = statsData.filter(
      (item: AssignmentApiResponse) => !item.returned && new Date(item.returnDue) < new Date()
    ).length;

    const returnedThisMonth = statsData.filter((item: AssignmentApiResponse) => {
      if (!item.returnedAt) return false;
      const returnDate = new Date(item.returnedAt);
      const today = new Date();
      return (
        returnDate.getMonth() === today.getMonth() &&
        returnDate.getFullYear() === today.getFullYear()
      );
    }).length;

    return { active, overdue, returnedThisMonth };
  }, [statsData]);

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
        <AssignmentsToolbar
          search={search}
          setSearch={setSearch}
          showOverdueOnly={showOverdueOnly}
          setShowOverdueOnly={setShowOverdueOnly}
        />
        <BookAssignmentDataTable
          columns={columns}
          data={formattedData}
          isLoading={isLoading}
        />
        <AssignmentStats
          active={stats.active}
          overdue={stats.overdue}
          returnedThisMonth={stats.returnedThisMonth}
        />
      </div>
    </div>
  );
}
