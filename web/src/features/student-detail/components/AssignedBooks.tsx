import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { BookOpen, Tag, User } from "lucide-react";

interface BookAssignment {
  id: string;
  assignedBy: string | null;
  book: {
    id: string;
    title: string;
    category: string | null;
    isbn: string | null;
  };
}

interface AssignedBooksProps {
  assignments: BookAssignment[] | null;
}

export function AssignedBooks({ assignments }: AssignedBooksProps) {
  const validAssignments = assignments || [];

  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100 text-gray-600 border-gray-200";
    
    const colors: Record<string, string> = {
      "Roman": "bg-purple-100 text-purple-700 border-purple-200",
      "Bilim": "bg-blue-100 text-blue-700 border-blue-200",
      "Tarih": "bg-amber-100 text-amber-700 border-amber-200",
      "Edebiyat": "bg-rose-100 text-rose-700 border-rose-200",
      "Felsefe": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Çocuk": "bg-green-100 text-green-700 border-green-200",
    };
    
    return colors[category] || "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-background to-background/95 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Atanan Kitaplar
          <Badge variant="secondary" className="ml-auto bg-emerald-50 text-emerald-700 border-emerald-200">
            {validAssignments.length} Kitap
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {validAssignments.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 rounded-full bg-muted/50 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Henüz atanmış kitap bulunmuyor</p>
            <p className="text-sm text-muted-foreground/80 mt-1">
              Bu öğrenciye kitap atandığında burada görünecektir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {validAssignments.map((assignment, index) => (
              <div key={assignment.id}>
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-semibold text-foreground leading-tight">
                        {assignment.book.title}
                      </h4>
                      {assignment.book.category && (
                        <Badge 
                          variant="outline" 
                          className={`shrink-0 ${getCategoryColor(assignment.book.category)}`}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {assignment.book.category}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {assignment.book.isbn && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">ISBN:</span>
                          <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                            {assignment.book.isbn}
                          </span>
                        </div>
                      )}
                      
                      {assignment.assignedBy && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Atan: {assignment.assignedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {index < validAssignments.length - 1 && (
                  <Separator className="my-3 bg-border/40" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
