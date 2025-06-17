import type { TransferHistoryRow } from "@/components/columns/transfer-history.columns";
import {
  columns,
} from "@/components/columns/transfer-history.columns";
import { TransferHistoryDataTable } from "@/components/data-table/transfer-history-data-table";
import { Button } from "@/components/ui/button";
import { TransferHistoryStats } from "@/features/transfer-history/components/TransferHistoryStats";
import { TransferHistoryToolbar } from "@/features/transfer-history/components/TransferHistoryToolbar";
import { api } from "@/lib/api";
import { exportToExcel } from "@/lib/export-utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { z } from "zod";

const transferHistorySearchSchema = z.object({
  q: z.string().optional(),
  classId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/transfer-history")({
  validateSearch: transferHistorySearchSchema,
  component: TransferHistoryPage,
});

function TransferHistoryPage() {
  const router = useRouter();
  const search = Route.useSearch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["transfer-history", search],
    queryFn: async () => {
      // @ts-ignore - a bug in eden-treaty requires this for now
      const res = await api["transfer-history"].index.get({ query: search });
      if (res.error) {
        throw new Error("Transfer geçmişi alınamadı");
      }
      return res.data;
    },
  });

  // Prepare data for Excel export
  const excelData = (data as TransferHistoryRow[] | undefined)?.map(item => ({
    studentName: item.student.name,
    oldClassName: typeof item.oldClass === 'object' ? item.oldClass.name : item.oldClass,
    newClassName: typeof item.newClass === 'object' ? item.newClass.name : item.newClass,
    transferDate: new Date(item.transferDate).toLocaleDateString('tr-TR'),
    reason: item.reason,
    processedBy: item.createdBy ? `${item.createdBy.role} ${item.createdBy.name}` : 'N/A',
    notes: item.notes,
  })) ?? [];

  const handleFilterChange = (newSearch: Record<string, any>) => {
    router.navigate({
        to: Route.fullPath,
        search: (prev) => ({ ...prev, ...newSearch }),
        replace: true
    });
  };

  if (isLoading) {
    return <div className="p-8">Yükleniyor...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Veri yüklenirken bir hata oluştu.</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Transfer Geçmişi
          </h1>
          <p className="text-muted-foreground">
            Tüm öğrenci transfer işlemlerinin kaydı
          </p>
        </div>
        <Button onClick={() => exportToExcel(excelData, "Transfer_Gecmisi")}>
            <Download className="mr-2 h-4 w-4" />
            Excel'e Aktar
        </Button>
      </div>

      <TransferHistoryToolbar filters={search} onFilterChange={handleFilterChange} />
      <TransferHistoryStats />
      <TransferHistoryDataTable
        columns={columns}
        data={data as TransferHistoryRow[]}
      />
    </div>
  );
}
