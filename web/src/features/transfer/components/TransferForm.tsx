"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Fragment, useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { debounce } from "lodash";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const transferFormSchema = z.object({
  studentId: z.string({ required_error: "Öğrenci seçimi zorunludur." }),
  newClassId: z.string({ required_error: "Yeni sınıf seçimi zorunludur." }),
  reason: z.string().min(1, "Transfer sebebi zorunludur."),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function TransferForm() {
  const queryClient = useQueryClient();
  const [studentSearch, setStudentSearch] = useState("");

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
  });

  const debouncedSetStudentSearch = useMemo(
    () => debounce((value: string) => setStudentSearch(value), 300),
    []
  );

  const {
    data: studentsData,
    fetchNextPage: fetchNextStudents,
    hasNextPage: hasNextStudents,
    isFetchingNextPage: isFetchingStudents,
  } = useInfiniteQuery({
    queryKey: ["students", studentSearch],
    queryFn: async ({ pageParam = 1 }) =>
      (await api.students.get({ query: { page: pageParam, limit: 10, name: studentSearch } })).data as any,
    getNextPageParam: (lastPage: any) =>
      lastPage.data.length === lastPage.limit ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const {
    data: classroomsData,
    fetchNextPage: fetchNextClassrooms,
    hasNextPage: hasNextClassrooms,
    isFetchingNextPage: isFetchingClassrooms,
  } = useInfiniteQuery({
    queryKey: ["classrooms"],
    queryFn: async ({ pageParam = 1 }) =>
      (await api.classrooms.get({ query: { page: pageParam, limit: 10 } })).data as any,
    getNextPageParam: (lastPage: any) =>
      lastPage.data.length === lastPage.limit ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const transferMutation = useMutation({
    mutationFn: (values: TransferFormValues) =>
      api.students.transfer.post(values),
    onSuccess: () => {
      toast.success("Öğrenci transferi başarıyla tamamlandı.");
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(`Transfer sırasında bir hata oluştu: ${error.message}`);
    },
  });

  const onSubmit = (data: TransferFormValues) => {
    transferMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Öğrenci Sınıf Transferi</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Öğrenci</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Transfer edilecek öğrenciyi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <div className="p-2">
                         <Input
                           placeholder="Öğrenci adı ile ara..."
                           onChange={(e) => debouncedSetStudentSearch(e.target.value)}
                         />
                      </div>
                      <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {studentsData?.pages.map((page, i) => (
                          <Fragment key={i}>
                            {page?.data?.map((student: any) => (
                              <motion.div key={student.id} variants={itemVariants}>
                                <SelectItem value={student.id}>{student.name} ({student.studentNo})</SelectItem>
                              </motion.div>
                            ))}
                          </Fragment>
                        ))}
                      </motion.div>
                      {hasNextStudents && (
                         <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onClick={() => fetchNextStudents()}
                            disabled={isFetchingStudents}
                          >
                           {isFetchingStudents ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="newClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeni Sınıf</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Öğrencinin transfer edileceği sınıfı seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        {classroomsData?.pages.map((page, i) => (
                          <Fragment key={i}>
                            {page?.data?.map((classroom: any) => (
                              <motion.div key={classroom.id} variants={itemVariants}>
                                <SelectItem value={classroom.id}>{classroom.name}</SelectItem>
                              </motion.div>
                            ))}
                          </Fragment>
                        ))}
                      </motion.div>
                       {hasNextClassrooms && (
                         <Button
                          className="w-full mt-2"
                          variant="ghost"
                          onClick={() => fetchNextClassrooms()}
                          disabled={isFetchingClassrooms}
                        >
                           {isFetchingClassrooms ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
                        </Button>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Sebebi</FormLabel>
                  <FormControl>
                    <Input placeholder="örn: Velisinin isteği üzerine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ek Notlar (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Transfer ile ilgili ek notlar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={transferMutation.isPending}>
              {transferMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Transfer Ediliyor...</> : "Transfer Et"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
