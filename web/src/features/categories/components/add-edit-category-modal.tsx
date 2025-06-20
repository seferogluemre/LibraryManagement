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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Category } from "../types";

interface AddEditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

type FormData = {
  name: string;
  description: string;
};

export function AddEditCategoryModal({
  open,
  onOpenChange,
  category,
}: AddEditCategoryModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  React.useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        description: category.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [category, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      if (category) {
        return api.categories[":id"].patch({
          params: { id: category.id.toString() },
          body: { name: data.name },
        });
      }
      return api.categories.post({ body: data });
    },
    onSuccess: () => {
      toast.success(
        `Kategori başarıyla ${category ? "güncellendi" : "oluşturuldu"}.`
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        `Kategori ${
          category ? "güncellenirken" : "oluşturulurken"
        } bir hata oluştu.`
      );
      console.error(error);
    },
    onSettled: () => {
        reset({
            name: "",
            description: "",
        });
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Kategori bilgilerini güncelleyin."
              : "Yeni bir kategori oluşturun."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              İsim
            </Label>
            <Input id="name" {...register("name", { required: "İsim zorunludur." })} className="col-span-3" />
            {errors.name && <p className="col-span-4 text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Açıklama
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 