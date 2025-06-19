import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUp, Library, Pen, Users } from "lucide-react";

// Mock data
const stats = [
    { title: "Toplam Yazar", value: 6, icon: Users },
    { title: "Toplam Kitap", value: 44, icon: Library },
    { title: "Yaşayan Yazar", value: 1, icon: Pen },
    { title: "Ortalama Kitap/Yazar", value: 7, icon: BookUp },
];

export function AuthorStats() {
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
                    </CardContent>
                </Card>
            ))}
        </div>
    );
} 