import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AuthorStatsProps {
    totalAuthors: number;
}

export function AuthorStats({ totalAuthors }: AuthorStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Yazar</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAuthors}</div>
                </CardContent>
            </Card>
        </div>
    );
} 