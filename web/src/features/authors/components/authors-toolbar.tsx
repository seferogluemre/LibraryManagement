import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export function AuthorsToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Yazar adı veya uyruk ile ara..."
          className="h-10 w-full md:w-[350px]"
        />
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Yeni Yazar Ekle
      </Button>
    </div>
  );
} 