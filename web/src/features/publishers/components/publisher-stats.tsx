import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
  
  interface PublisherStatsProps {
    totalPublishers: number;
  }
  
  export function PublisherStats({ totalPublishers }: PublisherStatsProps) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yayınevi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPublishers}</div>
          </CardContent>
        </Card>
      </div>
    );
  } 