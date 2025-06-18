import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import { CheckCircle, Loader2, PlusCircle, XCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type Classroom = {
  id: string;
  name: string;
};

export type AddStudentFormData = {
  name: string;
  email: string | null;
  studentNo: string;
  classId: string;
};

export function AddStudentForm() {
  const [isOpen, setIsOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { data: classrooms, isLoading: isLoadingClassrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: async () => {
      const res = await api.classrooms.index.get();
      if (res.error) throw new Error("Sınıflar alınamadı");
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AddStudentFormData) => {
      const res = await api.students.post({
        ...values,
        studentNo: Number(values.studentNo),
      });
      if (res.error) throw new Error(res.error.value.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Öğrenci başarıyla eklendi.", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error("Öğrenci eklenemedi.", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  const form = useForm<AddStudentFormData>({
    defaultValues: { name: "", email: "", studentNo: "", classId: "" },
  });

  function onSubmit(values: AddStudentFormData) {
    mutate(values);
  }

  React.useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Öğrenci Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Öğrenci Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir öğrenci kaydı oluşturmak için formu doldurun.
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
                    <Input placeholder="Ahmet Yılmaz" {...field} required />
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
                  <FormLabel>E-posta (İsteğe Bağlı)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ornek@okul.edu.tr" {...field} />
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
                    <Input placeholder="12345" {...field} required />
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
                    disabled={isLoadingClassrooms}
                    required
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir sınıf seçin..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classrooms?.map((classroom: Classroom) => (
                        <SelectItem key={classroom.id} value={classroom.id}>
                          {classroom.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPending ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
