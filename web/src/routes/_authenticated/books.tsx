import { columns } from "@/components/columns/books-columns";
import { BooksDataTable } from "@/components/data-table/books-data-table";
import { BooksToolbar } from "@/features/books/components/books-toolbar";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/books")({
  component: BooksPage,
});

function BooksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      // @ts-ignore
      const res = await api.books.get();
      if (res.error) {
        throw new Error("Kitaplar alınamadı.");
      }
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/10 rounded-md">
        <h2 className="text-xl font-semibold text-destructive">
          Bir Hata Oluştu
        </h2>
        <p className="text-muted-foreground mt-2">
          Kitaplar yüklenirken bir sorunla karşılaşıldı. Lütfen daha sonra
          tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kitap Yönetimi</h1>
          <p className="text-muted-foreground">
            Kütüphanedeki tüm kitapları yönetin
          </p>
        </div>
      </div>
      <BooksToolbar />
      <BooksDataTable columns={columns} data={data || []} />
    </div>
  );
}
