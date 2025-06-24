"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import type { Class } from "@/routes/_authenticated/classes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditClassroomFormData = {
  name: string;
};

interface AddEditClassroomModalProps {
  classroom: Class;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEditClassroomModal({
  classroom,
  isOpen,
  onOpenChange,
}: AddEditClassroomModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditClassroomFormData>({
    defaultValues: { name: classroom.name },
  });

  const { mutate: updateClassroom, isPending } = useMutation({
    mutationFn: async (data: EditClassroomFormData) => {
      const res = await api.classrooms[classroom.id].patch({
        name: data.name,
      });
      if (res.error) {
        throw new Error(res.error.value.message);
      }
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(`Sınıf adı '${data.name}' olarak başarıyla güncellendi.`, {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["classrooms"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Sınıf güncellenemedi.", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  function onSubmit(values: EditClassroomFormData) {
    updateClassroom(values);
  }

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ name: classroom.name });
    }
  }, [isOpen, classroom, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sınıfı Düzenle</DialogTitle>
          <DialogDescription>
            Sınıf adını güncellemek için yeni adı girin.
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
              {isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 