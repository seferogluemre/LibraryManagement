import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { GraduationCap, Mail, UserCheck } from "lucide-react";

interface StudentInfoProps {
  student: {
    id: string;
    name: string;
    email: string;
    studentNo: string;
    currentClass?: {
      id: string;
      name: string;
    } | null;
  };
}

export function StudentInfo({ student }: StudentInfoProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border border-border/50 bg-gradient-to-br from-background to-background/95 shadow-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <UserCheck className="h-6 w-6 text-primary" />
          Öğrenci Bilgileri
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar ve Temel Bilgiler */}
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-md">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} 
              alt={student.name} 
            />
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {student.name}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  #{student.studentNo}
                </Badge>
                {student.currentClass && (
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    {student.currentClass.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* İletişim Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">E-posta</p>
              <p className="text-sm font-semibold text-foreground">{student.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <UserCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Öğrenci No</p>
              <p className="text-sm font-semibold text-foreground">#{student.studentNo}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
