import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate({ to: "/login" });
  };

  const handleNavigation = (path: string) => {
    // Auth kontrollü yönlendirme - bu sayfalar henüz yoksa login sayfasına yönlendirir
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate({ to: "/login" });
      return;
    }
    
    // Şimdilik dashboard'da kalalım, ileride bu sayfalar eklendiğinde aktif olur
    console.log(`Navigating to ${path} - This page will be implemented later`);
    alert(`${path} sayfası henüz hazır değil. İleride eklenecek.`);
  };

  const userEmail = localStorage.getItem("userEmail") || "user@okul.edu.tr";

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Hoş geldiniz, {userEmail}</p>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Toplam Kitap</h3>
            <p className="text-2xl font-bold text-primary">1,247</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Aktif Öğrenci</h3>
            <p className="text-2xl font-bold text-primary">856</p>
          </div>
          <div className="p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Ödünç Verilen</h3>
            <p className="text-2xl font-bold text-primary">234</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-16"
              onClick={() => handleNavigation("/books")}
            >
              Kitap Ekle
            </Button>
            <Button
              variant="outline"
              className="h-16"
              onClick={() => handleNavigation("/students")}
            >
              Öğrenci Ekle
            </Button>
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => handleNavigation("/assignments")}
            >
              Ödünç Ver
            </Button>
            <Button 
              variant="outline" 
              className="h-16"
              onClick={() => handleNavigation("/returns")}
            >
              İade Al
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: DashboardPage,
});
