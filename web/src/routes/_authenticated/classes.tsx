import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { classColumns } from "@/features/classes/components/class-columns";
import {
  classroomsResponseSchema,
  type ClassroomsResponse,
} from "@/features/classes/schemas/classroom-schema";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

export type Class = ClassroomsResponse[number] & { studentCount: number };

function ClassesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["classrooms"],
    queryFn: async (): Promise<ClassroomsResponse> => {
      const res = await api.classrooms.index.get();
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return classroomsResponseSchema.parse(res.data);
    },
  });

  const formattedData: Class[] = useMemo(() => {
    if (!data) return [];
    return data.map((classroom) => ({
      ...classroom,
      studentCount: classroom.students.length,
    }));
  }, [data]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sınıflar</h1>
          <p className="text-muted-foreground">
            Okuldaki tüm sınıfları yönetin
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Yeni Sınıf Ekle
            </span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <DataTable
          columns={classColumns}
          data={formattedData}
          searchColumn="name"
          searchPlaceholder="Sınıf adı ile ara..."
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sınıf</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/4" />
            ) : (
              <div className="text-2xl font-bold">{data?.length ?? 0}</div>
            )}
            <p className="text-xs text-muted-foreground">
              Sistemde kayıtlı toplam sınıf sayısı
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 