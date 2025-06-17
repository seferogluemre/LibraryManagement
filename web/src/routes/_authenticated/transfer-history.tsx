import { TransferHistoryStats } from "@/features/transfer-history/components/TransferHistoryStats";
import { TransferHistoryToolbar } from "@/features/transfer-history/components/TransferHistoryToolbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/transfer-history")({
  component: TransferHistoryPage,
});

function TransferHistoryPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* 1. Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transfer Geçmişi</h1>
          <p className="text-muted-foreground">
            Tüm öğrenci transfer işlemlerinin kaydı
          </p>
        </div>
      </div>

      {/* 2. Filtreleme ve Aksiyon Alanı */}
      <div className="mb-6">
        <TransferHistoryToolbar />
      </div>

      {/* 3. İstatistik Kartları */}
      <div className="mb-6">
        <TransferHistoryStats />
      </div>

      {/* 4. Data Table */}
      <div>{/* Placeholder for Data Table */}</div>
    </div>
  );
} 