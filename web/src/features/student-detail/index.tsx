import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, User } from "lucide-react";
import { AssignedBooks } from "./components/AssignedBooks";
import { StudentDetailSkeleton } from "./components/StudentDetailSkeleton";
import { StudentInfo } from "./components/StudentInfo";
import { TransferHistory } from "./components/TransferHistory";

interface StudentDetailPageProps {
  studentId: string;
}

export function StudentDetailPage({ studentId }: StudentDetailPageProps) {
  const router = useRouter();

  const { data: student, isLoading, error } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => {
      const res = await api.students({ id: studentId }).get();
      if (res.error) {
        throw new Error('Öğrenci bilgileri getirilemedi');
      }
      return res.data;
    },
  });

  const handleGoBack = () => {
    router.navigate({ to: '/students' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Öğrencilere Dön
          </Button>
        </div>
        <StudentDetailSkeleton />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Öğrencilere Dön
          </Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-6 rounded-full bg-red-50 text-red-600 mb-4">
            <User className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Öğrenci Bulunamadı</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Aradığınız öğrenci bulunamadı veya erişim izniniz bulunmuyor.
          </p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Öğrencilere Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack}
          className="hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Öğrencilere Dön
        </Button>
        
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Öğrenci Detayları
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Öğrenci bilgileri ve kitap atama geçmişi
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Student Basic Info */}
        <StudentInfo student={student} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assigned Books */}
          <AssignedBooks assignments={student.assignments} />
          
          {/* Transfer History */}
          <TransferHistory transferHistories={student.transferHistories} />
        </div>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}
