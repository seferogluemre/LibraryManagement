import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, Calendar, CheckCircle, Users } from "lucide-react";

// NOTE: These are placeholder values.
// The actual data will come from an API call.
const stats = [
    {
      title: "Toplam Transfer",
      value: "6",
      description: "Bu dönem",
      icon: ArrowDownUp,
    },
    {
      title: "Sınıf Geçme",
      value: "1",
      description: "En yaygın sebep",
      icon: CheckCircle,
    },
    {
      title: "Bu Ay",
      value: "0",
      description: "Transfer sayısı",
      icon: Calendar,
    },
    {
      title: "En Aktif Sınıf",
      value: "11-A",
      description: "En çok transfer alan",
      icon: Users,
    },
  ];

export function TransferHistoryStats() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 