import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddEditCategoryModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Yeni Kategori Ekle</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kategori Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir kitap kategorisi ekleyin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Kategori Adı</Label>
            <Input type="text" id="name" placeholder="Kategori Adı" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Kaydet</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 