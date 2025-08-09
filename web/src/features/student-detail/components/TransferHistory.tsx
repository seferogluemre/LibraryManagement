import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ArrowRight, Clock, FileText, History } from "lucide-react";

interface TransferHistoryItem {
  id: string;
  newClass: {
    id: string;
    name: string;
  };
  oldClass: {
    id: string;
    name: string;
  };
  notes: string | null;
  transferDate: string | null;
  createdAt: string;
  student: {
    name: string;
    studentNo: string;
    id: string;
  };
}

interface TransferHistoryProps {
  transferHistories: TransferHistoryItem[] | null;
}

export function TransferHistory({ transferHistories }: TransferHistoryProps) {
  const validTransfers = transferHistories || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Tarih belirtilmemiş";
    try {
      return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: tr });
    } catch {
      return "Geçersiz tarih";
    }
  };

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-background to-background/95 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <History className="h-5 w-5 text-blue-600" />
          Transfer Geçmişi
          <Badge variant="secondary" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
            {validTransfers.length} Transfer
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validTransfers.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Transfer geçmişi bulunmuyor</p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Bu öğrencinin sınıf değişikliği geçmişi burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {validTransfers.map((transfer, index) => (
              <div key={transfer.id}>
                <div className="relative">
                  {/* Timeline Çizgisi */}
                  {index < validTransfers.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent" />
                  )}
                  
                  <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
                    {/* Timeline Noktası */}
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 shrink-0 relative z-10">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      {/* Transfer Bilgisi */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {transfer.oldClass.name}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {transfer.newClass.name}
                        </Badge>
                      </div>
                      
                      {/* Tarih Bilgisi */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {transfer.transferDate 
                            ? formatDate(transfer.transferDate)
                            : formatDate(transfer.createdAt)
                          }
                        </span>
                      </div>
                      
                      {/* Notlar */}
                      {transfer.notes && (
                        <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200">
                          <FileText className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800">Not:</p>
                            <p className="text-sm text-amber-700 mt-1">{transfer.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < validTransfers.length - 1 && (
                  <div className="my-3" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
