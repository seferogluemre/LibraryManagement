import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { useLocationStore } from "@/stores/location-store";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Clock, MapPin, Users } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/online-users")({
  component: OnlineUsersPage,
});

const onlineUserSchema = z.object({
  userId: z.string(),
  isOnline: z.boolean(),
  socketId: z.string(),
  lastSeen: z.string(),
  name: z.string(),
  role: z.string(),
});

type OnlineUser = z.infer<typeof onlineUserSchema>;

// Mock data for statuses that are not available in the API
const userStatuses: Record<
  string,
  { status: "Çevrimiçi" | "Uzakta" | "Meşgul"; location: string; color: string }
> = {
  "Ahmet Yılmaz": {
    status: "Meşgul",
    location: "Ana Kütüphane",
    color: "bg-red-500",
  },
  "Zeynep Arslan": {
    status: "Meşgul",
    location: "Ödünç Masası",
    color: "bg-red-500",
  },
  "Mehmet Kaya": {
    status: "Uzakta",
    location: "Okuma Salonu",
    color: "bg-yellow-500",
  },
  "Elif Demir": {
    status: "Meşgul",
    location: "Bilgisayar Bölümü",
    color: "bg-red-500",
  },
  "Can Öztürk": {
    status: "Çevrimiçi",
    location: "Sessiz Çalışma Alanı",
    color: "bg-green-500",
  },
};

function getInitials(name: string) {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

const roleTranslations: Record<OnlineUser["role"], string> = {
  ADMIN: "İdare",
  TEACHER: "Ögretmen", // Assuming TEACHER maps to Kütüphaneci based on image
};

function OnlineUsersPage() {
  const {
    data: onlineUsers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["online-users"],
    queryFn: async () => {
      const res = await api.users["online-users"].get();
       
      return res.data;
    },
    retry: false,
  });

  const { city, district } = useLocationStore();

  if (isLoading) return <div>Yükleniyor...</div>;

  if (isError) {
    console.error("Veri çekme hatası:", error);
    return <div>Çevrimiçi kullanıcılar yüklenirken bir hata oluştu. Lütfen konsolu kontrol edin.</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Çevrimiçi Kullanıcılar
          </h1>
        </div>
        <Badge variant="outline" className="text-lg">
          {onlineUsers?.count ?? 0} Aktif
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {onlineUsers?.users.map((user: any) => {
          const mockStatus = userStatuses[user.name] ?? {
            status: "Çevrimiçi",
            location: "Bilinmeyen Konum",
            color: "bg-green-500",
          };
          return (
            <Card key={user.userId} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar className="h-20 w-20 border-2 border-muted">
                    <AvatarImage
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-1 block h-4 w-4 rounded-full ${mockStatus.color} border-2 border-background ring-2 ring-background`}
                    title={mockStatus.status}
                  />
                </div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {roleTranslations[user.role] || "Öğrenci"}
                </p>
                <div className="mt-4 w-full text-xs text-muted-foreground space-y-2">
                   <div className="flex items-center justify-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>
                      {formatDistanceToNow(new Date(user.lastSeen), {
                        addSuffix: true,
                        locale: tr,
                      })+"  Giriş yaptı"
                      }
                    </span>
                   </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>{city && district ? `${district}, ${city}` : "Konum Bilinmiyor"}</span>
                  </div>
                </div>  
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
