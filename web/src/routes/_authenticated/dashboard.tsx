import { ThemeToggle } from "@/components/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearLocalStorageAuthState } from "@/lib/auth";
import { createFileRoute, useRouteContext, useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Book,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

// Mock Data (Yer Tutucu Veriler)
const stats = [
  { title: "Toplam Kitap", value: "2,847", change: "+12 bu ay", icon: Book },
  { title: "Toplam Öğrenci", value: "1,245", change: "+23 bu dönem", icon: Users },
  { title: "Ödünç Verilen", value: "342", change: "+18% geçen haftadan", icon: ArrowUpRight },
  { title: "Gecikmiş Kitap", value: "28", change: "Acil eylem gerekli", icon: AlertTriangle, color: "text-red-500" },
];

const mostReadBooks = [
  { title: "Suç ve Ceza", author: "Dostoyevski", count: 24 },
  { title: "1984", author: "George Orwell", count: 18 },
  { title: "Simyacı", author: "Paulo Coelho", count: 15 },
  { title: "Küçük Prens", author: "Saint-Exupéry", count: 12 },
];

const activeStudents = [
  { name: "Ahmet Yılmaz", class: "11-A", books: 8, fallback: "AY" },
  { name: "Zeynep Kaya", class: "10-B", books: 7, fallback: "ZK" },
  { name: "Mehmet Demir", class: "12-C", books: 6, fallback: "MD" },
  { name: "Elif Arslan", class: "9-A", books: 5, fallback: "EA" },
];

const overdueBooks = [
    { title: "Sefiller", author: "Can Öztürk", due: 12 },
    { title: "Hayvan Çiftliği", author: "Ayşe Yıldız", due: 8 },
    { title: "Dönüşüm", author: "Emre Şahin", due: 5 },
    { title: "Satranç", author: "Selin Koç", due: 3 },
];

function DashboardPage() {
  const auth = useRouteContext({ from: Route.id });
  const router = useRouter();

  const handleLogout = () => {
    auth.logout();
    toast.info("Oturumunuz başarıyla kapatıldı.");
    clearLocalStorageAuthState();
    router.navigate({ to: "/login" });
  };  

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header Alanı */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Kütüphane yönetim sistemi ana sayfası</p>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="icon">
                <Bell className="h-5 w-5"/>
                <span className="sr-only">Bildirimler</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Çıkış Yap</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Oturumunuzu sonlandırmak istediğinizden emin misiniz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Evet, Çıkış Yap</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>

      {/* 2. İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 text-muted-foreground ${stat.color || ''}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* 3. Liste Kartları */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* En Çok Okunanlar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>En Çok Okunan Kitaplar</CardTitle>
            <p className="text-sm text-muted-foreground">Bu ay en popüler kitaplar</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {mostReadBooks.map((book) => (
                <div key={book.title} className="flex items-center">
                    <div className="p-3 bg-muted rounded-md mr-4">
                        <Book className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono text-sm">{book.count}</Badge>
                </div>
            ))}
          </CardContent>
        </Card>

        {/* En Aktif Öğrenciler */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>En Aktif Öğrenciler</CardTitle>
            <p className="text-sm text-muted-foreground">Bu dönem en çok kitap okuyan öğrenciler</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeStudents.map((student) => (
              <div key={student.name} className="flex items-center">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback>{student.fallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.class}</p>
                </div>
                <Badge variant="outline">{student.books} kitap</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Geciken Kitaplar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-red-500">Geciken Kitaplar</CardTitle>
            <p className="text-sm text-muted-foreground">Acil eylem gerektiren iadeler</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {overdueBooks.map((book) => (
                <div key={book.title} className="flex items-center">
                    <div className="p-3 text-red-500 rounded-md mr-4">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge variant="destructive">{book.due} gün</Badge>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
