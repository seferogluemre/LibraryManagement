import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export function BooksToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Kitap adı, yazar veya ISBN ile ara..."
          className="h-10 w-[150px] lg:w-[350px]"
        />
        {/* We will add a category select component here later */}
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Yeni Kitap Ekle
      </Button>
    </div>
  );
} 