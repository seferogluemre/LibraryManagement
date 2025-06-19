import { columns, type Author } from '@/components/columns/authors-columns';
import { AuthorsDataTable } from '@/components/data-table/authors-data-table';
import { AddEditAuthorModal } from "@/features/authors/components/add-edit-author-modal";
import { AuthorStats } from "@/features/authors/components/author-stats";
import { AuthorsToolbar } from '@/features/authors/components/authors-toolbar';
import { DeleteAuthorDialog } from "@/features/authors/components/delete-author-dialog";
import { PopularAuthors } from "@/features/authors/components/popular-authors";
import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from "react";


export const Route = createFileRoute('/_authenticated/authors')({
  component: AuthorsPage,
});

// Mock Data
const mockAuthors: Author[] = [
    { id: '1', name: 'Fyodor Dostoyevski', bookCount: 8 },
    { id: '2', name: 'George Orwell', bookCount: 5 },
    { id: '3', name: 'Paulo Coelho', bookCount: 12 },
    { id: '4', name: 'Antoine de Saint-Exupéry', bookCount: 6 },
    { id: '5', name: 'Victor Hugo', bookCount: 9 },
    { id: '6', name: 'Franz Kafka', bookCount: 4 },
];

function AuthorsPage() {
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredData = useMemo(() => {
        if (!searchQuery) return mockAuthors;
        return mockAuthors.filter(author => 
            author.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yazarlar</h1>
        <p className="text-muted-foreground">
          Kütüphanedeki kitapların yazarlarını yönetin
        </p>
      </div>

      <AuthorsToolbar />
      <AuthorsDataTable columns={columns} data={filteredData} />
      <PopularAuthors />
      <AuthorStats />

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