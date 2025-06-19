import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { columns, type Author } from "@/components/columns/authors-columns";
import { AuthorsDataTable } from "@/components/data-table/authors-data-table";
import { AddEditAuthorModal } from "@/features/authors/components/add-edit-author-modal";
import { AuthorStats } from "@/features/authors/components/author-stats";
import { AuthorsToolbar } from "@/features/authors/components/authors-toolbar";
import { DeleteAuthorDialog } from "@/features/authors/components/delete-author-dialog";
import { PopularAuthors } from "@/features/authors/components/popular-authors";
import { api } from "@/lib/api";

const authorSearchSchema = z.object({
  page: z.number().min(1).catch(1),
  pageSize: z.number().min(1).catch(10),
  q: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/authors")({
  validateSearch: authorSearchSchema,
  component: AuthorsPage,
});

function AuthorsPage() {
  const router = useRouter();
  const { page, pageSize, q } = Route.useSearch();
  const queryClient = useQueryClient();
  
  const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [searchQuery, setSearchQuery] = useState(q || "");

  useEffect(() => {
    const handler = setTimeout(() => {
        // @ts-ignore
      router.navigate({ search: (prev) => ({ ...prev, q: searchQuery || undefined, page: 1 }) });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["authors", { page, pageSize, q }],
    queryFn: async () => {
      const res = await api.authors.get({ query: { page, limit: pageSize, name: q } });
      if (res.error) throw new Error(res.error.value.message);
      return res.data;
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (authorId: string) => api.authors({ id: authorId }).delete(),
    onSuccess: () => {
      toast.success("Yazar başarıyla silindi.");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    },
    onError: (error: Error) => toast.error(`Bir hata oluştu: ${error.message}`),
  });

  const handleOpenAddModal = () => { setSelectedAuthor(null); setAddEditModalOpen(true); };
  const handleOpenEditModal = (author: Author) => { setSelectedAuthor(author); setAddEditModalOpen(true); };
  const handleOpenDeleteDialog = (author: Author) => { setSelectedAuthor(author); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = () => { if (selectedAuthor) { deleteMutation.mutate(selectedAuthor.id); } };
  
  const authors = data?.data ?? [];
  const totalAuthors = data?.total ?? 0;
  const pageCount = totalAuthors ? Math.ceil(totalAuthors / pageSize) : 0;

  const pagination: PaginationState = { pageIndex: page - 1, pageSize };

  const setPagination: OnChangeFn<PaginationState> = (updater) => {
    const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
    router.navigate({
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        page: newPagination.pageIndex + 1,
        pageSize: newPagination.pageSize,
      }),
      replace: true,
    });
  };

  if (isLoading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  if (isError) return <div className="p-8 text-center bg-destructive/10 rounded-md"><h2 className="text-xl font-semibold text-destructive">Bir Hata Oluştu</h2><p className="text-muted-foreground mt-2">Yazarlar yüklenirken bir sorunla karşılaşıldı.</p></div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yazarlar</h1>
        <p className="text-muted-foreground">Kütüphanedeki kitapların yazarlarını yönetin</p>
      </div>
      <AuthorsToolbar onAdd={handleOpenAddModal} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AuthorsDataTable
        columns={columns({ onEdit: handleOpenEditModal, onDelete: handleOpenDeleteDialog })}
        data={authors}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
      <PopularAuthors authors={authors} />
      <AuthorStats totalAuthors={totalAuthors} />
      <AddEditAuthorModal isOpen={isAddEditModalOpen} onClose={() => setAddEditModalOpen(false)} author={selectedAuthor} />
      <DeleteAuthorDialog isOpen={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} isLoading={deleteMutation.isPending} />
    </div>
  );
}
