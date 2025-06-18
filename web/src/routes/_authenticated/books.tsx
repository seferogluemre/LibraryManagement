import { columns, type Book } from '@/components/columns/books-columns';
import { BooksDataTable } from '@/components/data-table/books-data-table';
import { BooksToolbar } from '@/features/books/components/books-toolbar';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/books')({
  component: BooksPage,
});

const mockData: Book[] = [
  {
    id: '1',
    title: 'Suç ve Ceza',
    author: { name: 'Fyodor Dostoyevski' },
    category: { name: 'Roman' },
    publisher: { name: 'İş Bankası Yayınları' },
    totalCopies: 5,
    availableCopies: 3,
  },
  {
    id: '2',
    title: '1984',
    author: { name: 'George Orwell' },
    category: { name: 'Distopya' },
    publisher: { name: 'Can Yayınları' },
    totalCopies: 4,
    availableCopies: 2,
  },
  {
    id: '3',
    title: 'Simyacı',
    author: { name: 'Paulo Coelho' },
    category: { name: 'Roman' },
    publisher: { name: 'Alfa Yayınları' },
    totalCopies: 6,
    availableCopies: 4,
  },
  {
    id: '4',
    title: 'Küçük Prens',
    author: { name: 'Antoine de Saint-Exupéry' },
    category: { name: 'Çocuk' },
    publisher: { name: 'Türkiye İş Bankası Yayınları' },
    totalCopies: 8,
    availableCopies: 6,
  },
    {
    id: '5',
    title: 'Sefiller',
    author: { name: 'Victor Hugo' },
    category: null, // Example of a book with no category
    publisher: { name: 'Can Yayınları' },
    totalCopies: 3,
    availableCopies: 1,
  },
];

function BooksPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kitap Yönetimi</h1>
          <p className="text-muted-foreground">
            Kütüphanedeki tüm kitapları yönetin
          </p>
        </div>
      </div>
      <BooksToolbar />
      <BooksDataTable columns={columns} data={mockData} />
    </div>
  );
} 