import { TransferHistoryDataTable } from "@/features/transfer-history/components/TransferHistoryDataTable";
import { TransferHistoryStats } from "@/features/transfer-history/components/TransferHistoryStats";
import { TransferHistoryToolbar } from "@/features/transfer-history/components/TransferHistoryToolbar";
import {
  columns,
  type TransferHistoryRow,
} from "@/features/transfer-history/components/transfer-history-columns";
import { createFileRoute } from "@tanstack/react-router";

// Placeholder data matching the design
const mockData: TransferHistoryRow[] = [
  {
    id: "1",
    studentName: "Ahmet Yılmaz",
    oldClass: "10-A",
    newClass: "11-A",
    transferDate: "15/01/2024",
    reason: "Sınıf geçme",
    processedBy: "Öğretmen Ayşe Kaya",
    notes: "Başarılı öğrenci, sınıf seviyesi yükseltildi",
  },
  {
    id: "2",
    studentName: "Zeynep Arslan",
    oldClass: "9-B",
    newClass: "9-A",
    transferDate: "10/01/2024",
    reason: "Öğrenci talebi",
    processedBy: "Öğretmen Mehmet Demir",
    notes: "Arkadaşlarıyla aynı sınıfta olmak istedi",
  },
  {
    id: "3",
    studentName: "Can Öztürk",
    oldClass: "11-B",
    newClass: "11-A",
    transferDate: "08/01/2024",
    reason: "Akademik performans",
    processedBy: "Öğretmen Ayşe Kaya",
    notes: "Matematik dersinde daha iyi performans için",
  },
  {
    id: "4",
    studentName: "Elif Demir",
    oldClass: "12-A",
    newClass: "12-B",
    transferDate: "05/01/2024",
    reason: "Ders programı uyumsuzluğu",
    processedBy: "Öğretmen Fatma Yıldız",
    notes: "Seçmeli ders çakışması nedeniyle",
  },
  {
    id: "5",
    studentName: "Mehmet Kaya",
    oldClass: "10-C",
    newClass: "10-A",
    transferDate: "03/01/2024",
    reason: "Sınıf kapanması",
    processedBy: "Öğretmen Mehmet Demir",
    notes: "10-C sınıfı kapatıldığı için transfer edildi",
  },
  {
    id: "6",
    studentName: "Selin Koç",
    oldClass: "9-A",
    newClass: "9-B",
    transferDate: "28/12/2023",
    reason: "Disiplin sorunu",
    processedBy: "Öğretmen Ayşe Kaya",
    notes: "Sınıf içi uyum problemi",
  },
];

export const Route = createFileRoute("/_authenticated/transfer-history")({
  component: TransferHistoryPage,
});

function TransferHistoryPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transfer Geçmişi</h1>
          <p className="text-muted-foreground">
            Tüm öğrenci transfer işlemlerinin kaydı
          </p>
        </div>
      </div>
      
      <TransferHistoryToolbar />
      <TransferHistoryStats />
      <TransferHistoryDataTable columns={columns} data={mockData} />
    </div>
  );
} 