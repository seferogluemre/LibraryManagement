import { columns } from "@/components/columns/publishers-columns";
import { PublishersDataTable } from "@/components/data-table/publishers-data-table";
import { PublisherStats } from "@/features/publishers/components/publisher-stats";
import { type Publisher } from "@/features/publishers/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/publishers")({
  component: PublishersPage,
});

// Mock data for now
const publishers: Publisher[] = [
  {
    id: "1",
    name: "İş Bankası Kültür Yayınları",
    establishmentYear: 1924,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      books: 45,
    },
  },
  {
    id: "2",
    name: "Can Yayınları",
    establishmentYear: 1981,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      books: 38,
    },
  },
  {
    id: "3",
    name: "Alfa Yayınları",
    establishmentYear: 1995,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: {
      books: 22,
    },
  },
];

function PublishersPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Yayınevleri</h1>
          <p className="text-muted-foreground">
            Kütüphanedeki kitapların yayınevlerini yönetin
          </p>
        </div>
      </div>
      <PublishersDataTable columns={columns} data={publishers} />
      <PublisherStats totalPublishers={publishers.length} />
    </div>
  );
} 