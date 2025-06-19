import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import type { Author } from "@/components/columns/authors-columns";
import { columns } from "@/components/columns/authors-columns";
import { AuthorsDataTable } from "@/components/data-table/authors-data-table";
import { AddEditAuthorModal } from "@/features/authors/components/add-edit-author-modal";
import { AuthorStats } from "@/features/authors/components/author-stats";
import { AuthorsToolbar } from "@/features/authors/components/authors-toolbar";
import { DeleteAuthorDialog } from "@/features/authors/components/delete-author-dialog";
import { PopularAuthors } from "@/features/authors/components/popular-authors";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/authors")({
  component: AuthorsPage,
});

function AuthorsPage() {
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authors"],
    queryFn: () => api.authors.get(),
  });

  const handleOpenAddModal = () => {
    setSelectedAuthor(null);
    setAddEditModalOpen(true);
  };

  const handleOpenEditModal = (author: Author) => {
    setSelectedAuthor(author);
    setAddEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (author: Author) => {
    setSelectedAuthor(author);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting author (Scenario):", selectedAuthor?.id);
    setDeleteDialogOpen(false);
    setSelectedAuthor(null);
  };

  const authors = data?.data?.data ?? [];
  const totalAuthors = data?.data?.total ?? 0;

  const filteredData = useMemo(() => {
    if (!searchQuery) return authors;
    return authors.filter((author) =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [authors, searchQuery]);

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  if (isError) return <div className="p-8 text-center bg-destructive/10 rounded-md"><h2 className="text-xl font-semibold text-destructive">Bir Hata Oluştu</h2><p className="text-muted-foreground mt-2">Yazarlar yüklenirken bir sorunla karşılaşıldı.</p></div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yazarlar</h1>
        <p className="text-muted-foreground">
          Kütüphanedeki kitapların yazarlarını yönetin
        </p>
      </div>

      <AuthorsToolbar onAdd={handleOpenAddModal} setSearchQuery={setSearchQuery} />
      <AuthorsDataTable
        columns={columns({ onEdit: handleOpenEditModal, onDelete: handleOpenDeleteDialog })}
        data={filteredData}
      />
      <PopularAuthors authors={authors} />
      <AuthorStats totalAuthors={totalAuthors} />

      <AddEditAuthorModal
        isOpen={isAddEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        author={selectedAuthor}
      />
      <DeleteAuthorDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
