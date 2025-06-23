"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Publisher } from "../types";

interface DeletePublisherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  publisher?: Publisher | null;
}

export function DeletePublisherDialog({
  isOpen,
  onClose,
  publisher,
}: DeletePublisherDialogProps) {
  if (!publisher) return null;

  const handleDelete = () => {
    // API call will be here later
    console.log("Deleting publisher:", publisher.id);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. "{publisher.name}" adlı yayınevini kalıcı
            olarak silecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Evet, Sil</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 