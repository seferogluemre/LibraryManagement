import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { AddClassroomForm } from "@/features/classes/components/AddClassroomForm";
import { classColumns } from "@/features/classes/components/class-columns";
import { type ClassroomsResponse } from "@/features/classes/types";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

export type Class = ClassroomsResponse[number] & { studentCount: number };

function ClassesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["classrooms"],
    queryFn: async (): Promise<ClassroomsResponse> => {
      const res = await api.classrooms.get();
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return res.data as ClassroomsResponse;
    },
  });
  const formattedData: Class[] = useMemo(() => {
    if (!data) return []; 
    return data?.data?.map((classroom) => ({
      ...classroom,
      studentCount: classroom?.students?.length ?? 0,
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
          <AddClassroomForm />
        </div>
      </div>

      <div className="grid gap-4">
        <DataTable
          columns={classColumns}
          data={data}
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
              <div className="text-2xl font-bold">{data?.total ?? 0}</div>
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