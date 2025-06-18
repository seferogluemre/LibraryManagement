import type { Book } from "@/components/columns/books-columns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
}

// Mock data for select inputs
const mockAuthors = [
  { id: "1", name: "Fyodor Dostoyevski" },
  { id: "2", name: "George Orwell" },
];
const mockPublishers = [
  { id: "1", name: "İş Bankası Yayınları" },
  { id: "2", name: "Can Yayınları" },
];
const mockCategories = [
  { id: "1", name: "Roman" },
  { id: "2", name: "Distopya" },
];

export function AddEditBookModal({
  isOpen,
  onClose,
  book,
}: AddEditBookModalProps) {
  const isEditMode = !!book;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted (Scenario):", { ...data, id: book?.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Kitap Düzenle" : "Yeni Kitap Ekle"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Kitap bilgilerini güncelleyin."
              : "Yeni bir kitabı kütüphaneye ekleyin."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="book-form" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Kitap Adı
            </Label>
            <Input id="title" name="title" defaultValue={book?.title} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isbn" className="text-right">
              ISBN
            </Label>
            <Input id="isbn" name="isbn" defaultValue={book?.id} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalCopies" className="text-right">
              Toplam Kopya
            </Label>
            <Input
              id="totalCopies"
              name="totalCopies"
              type="number"
              defaultValue={book?.totalCopies}
              className="col-span-3"
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" form="book-form">
            {isEditMode ? "Değişiklikleri Kaydet" : "Kitap Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 