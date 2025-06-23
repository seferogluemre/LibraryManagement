"use client";

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
import { useEffect, useState } from "react";
import { type Publisher } from "../types";

interface AddEditPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher?: Publisher | null;
}

export function AddEditPublisherModal({
  isOpen,
  onClose,
  publisher,
}: AddEditPublisherModalProps) {
  const [name, setName] = useState("");
  const isEditMode = publisher != null;

  useEffect(() => {
    if (isEditMode) {
      setName(publisher.name);
    } else {
      setName("");
    }
  }, [publisher, isEditMode]);

  const handleSave = () => {
    // API call will be here later
    console.log("Saving publisher:", { id: publisher?.id, name });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Yayınevi Düzenle" : "Yeni Yayınevi Ekle"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Yayınevi bilgilerini güncelleyin."
              : "Yeni bir yayınevi oluşturun."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Adı
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" onClick={handleSave}>
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 