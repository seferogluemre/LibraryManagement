"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, Plus, XCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AddClassroomFormData = {
  name: string;
};

/**
 * Girilen sınıf adını standart bir formata dönüştürür.
 * Örnek: "11h" -> "11-H", "9 a" -> "9-A", "hazırlık" -> "Hazırlık"
 */
function formatClassroomName(rawName: string): string {
  const trimmedName = rawName.trim();
  const match = trimmedName.match(/^(\d+)\s*([a-zA-Z])$/);

  if (match) {
    const number = match[1];
    const letter = match[2].toUpperCase();
    return `${number}-${letter}`;
  }

  return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
}

export function AddClassroomForm() {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddClassroomFormData>({
    defaultValues: { name: "" },
  });

  const { mutate: createClassroom, isPending } = useMutation({
    mutationFn: async (data: AddClassroomFormData) => {
      const formattedName = formatClassroomName(data.name);
      const accessToken = localStorage.getItem("accessToken");

      // 1. Adım: Token var mı diye kontrol et.
      if (!accessToken) {
        toast.error("Oturum bulunamadı", {
          description: "Bu işlemi yapmak için lütfen giriş yapın.",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        });
        // Hata fırlatarak işlemi durdur.
        throw new Error("Access token not found in localStorage.");
      }

      const res = await api.classrooms.post({ name: formattedName },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return { ...res.data, originalName: data.name };
    },
    onSuccess: (data) => {
      toast.success(`'${data.originalName}' sınıfı '${data.name}' olarak başarıyla eklendi.`, {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Sınıf eklenemedi.", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  function onSubmit(values: AddClassroomFormData) {
    createClassroom(values);
  }

  React.useEffect(() => {
    // Modal kapandığında formu temizle
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Yeni Sınıf Ekle
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Sınıf Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir sınıf oluşturmak için sınıf adını girin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sınıf Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: 11A" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Ekleniyor..." : "Sınıfı Ekle"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}