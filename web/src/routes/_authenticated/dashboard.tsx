import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/context/theme/theme-toggle";
import type { OverdueBook, ReportsResponse, TopBook, TopStudent } from "@/features/reports/types";
import { api } from "@/lib/api";
import { clearLocalStorageAuthState } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouteContext, useRouter } from "@tanstack/react-router";
import {
    AlertTriangle,
    ArrowUpRight,
    Book,
    Users
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const auth = useRouteContext({ from: "/_authenticated/dashboard" });
  const router = useRouter();

  const {
    data: reports,
    isLoading,
    isError,
    error,
  } = useQuery<ReportsResponse>({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await api.reports.get();
      if (response.error || !response.data) {
        throw new Error(
          (response.error?.value as { message: string })?.message || "Raporlar alınamadı"
        );
      }
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="p-4">Raporlar yükleniyor...</div>;
  }

  if (isError) {
    return <div className="p-4 text-red-500">Hata: {error.message}</div>;
  }
  
  if (!reports) {
    return <div className="p-4">Rapor verisi bulunamadı.</div>;
  }

  const handleLogout = () => {
    if (auth.logout) {
      auth.logout();
      clearLocalStorageAuthState();
      toast.info("Oturumunuz başarıyla kapatıldı.");
      if(router.history.location.pathname !== "/login") {
        router.navigate({ to: "/login" });
      }
    }
  };  

  const stats = [
    { title: "Toplam Kitap", value: String(reports.systemStats[0].totalBooks ?? 'N/A'), icon: Book },
    { title: "Toplam Öğrenci", value: String(reports.systemStats[0].totalStudents ?? 'N/A'), icon: Users },
    { title: "Ödünç Verilen", value: String(reports.systemStats[0].totalActiveAssignments ?? 'N/A'), icon: ArrowUpRight },
    { title: "Gecikmiş Kitap", value: String(reports.systemStats[0].totalOverdueBooks ?? 'N/A'), icon: AlertTriangle, color: "text-red-500" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
        <ModeToggle />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 text-muted-foreground ${stat.color || ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>En Çok Okunan Kitaplar</CardTitle>
            <p className="text-sm text-muted-foreground">Bu ay en popüler kitaplar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.topBooks.slice(0, 10).map((book: TopBook) => (
                <div key={book.id} className="flex items-center">
                    <div className="p-3 bg-muted rounded-md mr-4">
                        <Book className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{String(book.title)}</p>
                        <p className="text-sm text-muted-foreground">{String(book.authorName)}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-sm">{String(book.totalTimesRead)}</Badge>
                </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>En Aktif Öğrenciler</CardTitle>
            <p className="text-sm text-muted-foreground">Bu dönem en çok kitap okuyan öğrenciler</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.topStudents.slice(0, 10).map((student: TopStudent) => (
              <div key={student.id} className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback>{String(student.name).charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{String(student.name)}</p>
                  <p className="text-sm text-muted-foreground">{String(student.className)}</p>
                </div>
                <Badge variant="outline">{String(student.totalBooksRead)} kitap</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-red-500">Geciken Kitaplar</CardTitle>
            <p className="text-sm text-muted-foreground">Acil eylem gerektiren iadeler</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.overdueBooks.slice(0, 10).map((book: OverdueBook) => (
                <div key={book.assignmentId} className="flex items-center">
                    <div className="p-3 text-red-500 rounded-md mr-4">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{String(book.bookTitle)}</p>
                        <p className="text-sm text-muted-foreground">{String(book.studentName)}</p>
                    </div>
                    <Badge variant="destructive">{String(book.daysOverdue)} gün</Badge>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

