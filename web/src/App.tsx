import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Kütüphane yönetim sistemi ana sayfası
          </p>
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

        <Button>Test Button</Button>
      </div>
    </MainLayout>
  );
}

export default App;
