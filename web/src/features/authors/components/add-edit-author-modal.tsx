import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock author type
type Author = { id: string; name: string; nationality: string; lifespan: string; bio: string; };

interface AddEditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author?: Author | null;
}

export function AddEditAuthorModal({ isOpen, onClose, author }: AddEditAuthorModalProps) {
  const isEditMode = !!author;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Yazar Düzenle" : "Yeni Yazar Ekle"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Yazar bilgilerini güncelleyin." : "Yeni bir yazarı sisteme ekleyin."}
          </DialogDescription>
        </DialogHeader>
        <form id="author-form" onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Yazar Adı</Label>
            <Input id="name" defaultValue={author?.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nationality">Uyruk</Label>
            <Input id="nationality" defaultValue={author?.nationality} />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="lifespan">Yaşam Dönemi</Label>
            <Input id="lifespan" defaultValue={author?.lifespan} placeholder="örn: 1903 - 1950"/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Biyografi (Kısa)</Label>
            <Textarea id="bio" defaultValue={author?.bio} />
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