import { categoriesColumns } from "@/components/columns/categories-columns";
import { CategoriesDataTable } from "@/components/data-table/categories-data-table";
import { CategoryStats } from "@/features/categories/components/category-stats";
import type { Category } from "@/features/categories/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/categories")({
  component: CategoriesPage,
});

// Mock Data for UI development
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Roman", description: "Kurgu eserler ve hikayeler", _count: { books: 156 } },
  { id: 2, name: "Bilim", description: "Bilimsel araştırmalar ve keşifler", _count: { books: 89 } },
  { id: 3, name: "Tarih", description: "Tarihsel olaylar ve dönemler", _count: { books: 67 } },
  { id: 4, name: "Felsefe", description: "Felsefi düşünceler ve teoriler", _count: { books: 45 } },
  { id: 5, name: "Çocuk", description: "Çocuklar için yazılmış kitaplar", _count: { books: 78 } },
];

function CategoriesPage() {


  const {data, isLoading, isError} = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.categories.get(),
  });

  if (isLoading) return <div className="p-8 text-center bg-destructive/10 rounded-md"><h2 className="text-xl font-semibold text-destructive">Bir Hata Oluştu</h2><p className="text-muted-foreground mt-2">Yazarlar yüklenirken bir sorunla karşılaşıldı.</p></div>;
  if (isError) return <div className="p-8 text-center bg-destructive/10 rounded-md"><h2 className="text-xl font-semibold text-destructive">Bir Hata Oluştu</h2><p className="text-muted-foreground mt-2">Yazarlar yüklenirken bir sorunla karşılaşıldı.</p></div>;



  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <p className="text-muted-foreground">
          Kitap kategorilerini yönetin ve düzenleyin
        </p>
      </div>
      <CategoryStats totalCategories={MOCK_CATEGORIES.length} />
      <CategoriesDataTable columns={categoriesColumns} data={data?.data?.data} />
    </div>
  );
} 