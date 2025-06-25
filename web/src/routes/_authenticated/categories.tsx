import { categoriesColumns } from "@/components/columns/categories-columns";
import { CategoriesDataTable } from "@/components/data-table/categories-data-table";
import { CategoryStats } from "@/features/categories/components/category-stats";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

/*
const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
// ... existing code ...
    description: "Hayal gücüne dayalı uzun anlatı türü.",
  },
];
*/

export const Route = createFileRoute("/_authenticated/categories")({
  component: CategoriesPage,
});

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
      <CategoryStats totalCategories={data?.data?.data?.length} />
      <CategoriesDataTable columns={categoriesColumns} data={data?.data?.data} />
    </div>
  );
} 