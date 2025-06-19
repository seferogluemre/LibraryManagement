import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Mock author type
type Author = { id: string; name: string; };

interface AddEditAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author?: Author | null;
}

export function AddEditAuthorModal({ isOpen, onClose, author }: AddEditAuthorModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!author;

  const authorMutation = useMutation({
    mutationFn: (values: { name: string }) => {
      const apiCall = isEditMode && author
        ? api.authors({ id: author.id }).patch(values)
        : api.authors.post(values);
      return apiCall;
    },
    onSuccess: (result: any) => {
      if (result.error) {
        toast.error(`Bir hata oluştu: ${result.error.value.message || result.error.value}`);
        return;
      }
      toast.success(isEditMode ? "Yazar başarıyla güncellendi!" : "Yazar başarıyla eklendi!");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Bir ağ hatası oluştu: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    authorMutation.mutate({ name });
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
            <Input id="name" name="name" defaultValue={author?.name} placeholder="örn: Fyodor Dostoyevski"/>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={authorMutation.isPending}>İptal</Button>
          <Button type="submit" form="author-form" disabled={authorMutation.isPending}>
            {authorMutation.isPending ? "Kaydediliyor..." : isEditMode ? "Değişiklikleri Kaydet" : "Yazar Ekle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 