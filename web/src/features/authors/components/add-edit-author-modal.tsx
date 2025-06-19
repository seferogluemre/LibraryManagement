import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock author type
type Author = { id: string; name: string; };

interface AddEditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author?: Author | null;
}

export function AddEditAuthorModal({ isOpen, onClose, author }: AddEditAuthorModalProps) {
  const isEditMode = !!author;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted (Scenario)");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Yazar Düzenle" : "Yeni Yazar Ekle"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Yazarın adını güncelleyin." : "Yeni bir yazarı sisteme ekleyin."}
          </DialogDescription>
        </DialogHeader>
        <form id="author-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Yazar Adı</Label>
            <Input id="name" defaultValue={author?.name} placeholder="örn: Fyodor Dostoyevski"/>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>İptal</Button>
          <Button type="submit" form="author-form">{isEditMode ? "Değişiklikleri Kaydet" : "Yazar Ekle"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 