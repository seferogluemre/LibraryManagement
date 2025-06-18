import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Activity, ArrowRightLeft, Hash, HelpCircle } from "lucide-react";

export function TransferHistoryStats() {
    const { data, isLoading } = useQuery({
        queryKey: ["transferStats"],
        queryFn: async () => {
            const res = await api.reports["transfer-stats"].get();
            if (res.error) throw new Error("İstatistikler alınamadı.");
            return res.data;
        }
    });

    const stats = [
        {
            title: "Toplam Transfer",
            value: data?.totalTransfers,
            icon: ArrowRightLeft,
            description: "Tüm zamanlardaki toplam transfer sayısı."
        },
        {
            title: "Bu Ayki Transferler",
            value: data?.monthlyTransfers,
            icon: Activity,
            description: "Bu ay içinde gerçekleşen transfer sayısı."
        },
        {
            title: "En Aktif Sınıf",
            value: data?.mostActiveClause,
            icon: Hash,
            description: "En çok transferin yapıldığı sınıf."
        },
        {
            title: "Yaygın Sebep",
            value: data?.mostCommonReason,
            icon: HelpCircle,
            description: "En sık belirtilen transfer sebebi."
        }
    ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-1/2" />
            ) : (
                <div className="text-2xl font-bold">{stat.value ?? 'N/A'}</div>
            )}
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
