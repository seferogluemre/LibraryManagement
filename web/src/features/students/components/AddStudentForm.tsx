"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, PlusCircle, XCircle } from "lucide-react";
import React, { Fragment } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type Classroom = {
  id: string;
  name: string;
};

const studentFormSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
  studentNo: z.coerce.number().positive("Öğrenci numarası pozitif bir sayı olmalıdır."),
  email: z.string().email("Geçerli bir e-posta adresi girin.").optional().or(z.literal("")),
  classId: z.string({ required_error: "Sınıf seçimi zorunludur." }),
});

type AddStudentFormValues = z.infer<typeof studentFormSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function AddStudentForm() {
  const [isOpen, setIsOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const {
    data: classroomsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["classrooms"],
    queryFn: async ({ pageParam = 1 }) =>
      (await api.classrooms.get({ query: { page: pageParam, limit: 10 } })).data as any,
    getNextPageParam: (lastPage: any) => {
      const morePagesExist = lastPage && lastPage.data.length === lastPage.limit;
      return morePagesExist ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: AddStudentFormValues) => {
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

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      studentNo: undefined,
      email: "",
      classId: "",
    },
  });

  function onSubmit(values: AddStudentFormValues) {
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Bir sınıf seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {classroomsData?.pages.map((page, i) => (
                          <Fragment key={i}>
                            {page?.data?.map((classroom: any) => (
                              <motion.div key={classroom.id} variants={itemVariants}>
                                <SelectItem value={classroom.id}>
                                  {classroom.name}
                                </SelectItem>
                              </motion.div>
                            ))}
                          </Fragment>
                        ))}
                        {hasNextPage && (
                          <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                          >
                            {isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
                          </Button>
                        )}
                      </motion.div>
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
