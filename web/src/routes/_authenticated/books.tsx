import { type Book, columns } from "@/components/columns/books-columns";
import { BooksDataTable } from "@/components/data-table/books-data-table";
import { AddEditBookModal } from "@/features/books/components/add-edit-book-modal";
import { BooksToolbar } from "@/features/books/components/books-toolbar";
import { DeleteBookDialog } from "@/features/books/components/delete-book-dialog";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/books")({
  component: BooksPage,
});

function BooksPage() {
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.books.get();
      if (res.error) throw new Error("Kitaplar alınamadı.");
      return res.data as Book[]; 
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bookId: string) => {
      return api.books({ id: bookId }).delete();
    },
    onSuccess: () => {
      toast.success("Kitap başarıyla silindi.");
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error) => {
      toast.error(`Kitap silinirken bir hata oluştu: ${error.message}`);
    },
    onSettled: () => {
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    },
  });

  const handleOpenAddModal = () => {
    setSelectedBook(null);
    setAddEditModalOpen(true);
  };

  const handleOpenEditModal = (book: Book) => {
    setSelectedBook(book);
    setAddEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (book: Book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBook) {
      deleteMutation.mutate(selectedBook.id);
    }
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    return data.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(book.id).includes(searchQuery)
    );
  }, [data, searchQuery]);

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
      <BooksToolbar
        onAdd={handleOpenAddModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BooksDataTable
        columns={columns({ onEdit: handleOpenEditModal, onDelete: handleOpenDeleteDialog })}
        data={filteredData}
      />

      <AddEditBookModal
        isOpen={isAddEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        book={selectedBook}
      />
      <DeleteBookDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
