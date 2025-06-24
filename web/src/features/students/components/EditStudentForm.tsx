import { type Student } from "@/components/columns/student-columns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Zod schema is no longer used, so we define the type directly.
export type EditStudentFormData = {
  name: string;
  email: string | null;
  studentNo: string;
  classId: string;
};

interface EditStudentFormProps {
  student: Student;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStudentForm({
  student,
  isOpen,
  onOpenChange,
}: EditStudentFormProps) {
  const queryClient = useQueryClient();

  const { data: classrooms, isLoading: isLoadingClassrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const res = await api.classrooms.index.get();
      if (res.error) throw new Error("Sınıflar alınamadı");
      return res.data;
    },
  });

  const { mutate: updateStudent, isPending } = useMutation({
    mutationFn: async (values: EditStudentFormData) => {
      const res = await api.students[student.id].patch({
        ...values,
        studentNo: values.studentNo ? Number(values.studentNo) : undefined,
      });
      if (res.error) throw new Error(res.error.value.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Öğrenci bilgileri başarıyla güncellendi.", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Öğrenci güncellenemedi.", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  const form = useForm<EditStudentFormData>({
    defaultValues: {
      name: student.name,
      email: student.email ?? "",
      studentNo: String(student.studentNo),
      classId: student.class.id,
    },
  });

  function onSubmit(values: EditStudentFormData) {
    updateStudent(values);
  }

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: student.name,
        email: student.email ?? "",
        studentNo: String(student.studentNo),
        classId: student.class.id,
      });
    }
  }, [isOpen, student, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Öğrenciyi Düzenle</DialogTitle>
          <DialogDescription>
            Öğrenci bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İsim Soyisim</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta (İsteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Öğrenci Numarası</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sınıf</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger disabled={isLoadingClassrooms}>
                        <SelectValue placeholder="Bir sınıf seçin..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classrooms?.map(
                        (classroom: { id: string; name: string }) => (
                          <SelectItem key={classroom.id} value={classroom.id}>
                            {classroom.name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Değişiklikleri Kaydet
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
