import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shapes } from "lucide-react";

type Props = {
  totalCategories: number;
};

export function CategoryStats({ totalCategories }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Toplam Kategori
          </CardTitle>
          <Shapes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCategories}</div>
        </CardContent>
      </Card>
    </div>
  );
} 