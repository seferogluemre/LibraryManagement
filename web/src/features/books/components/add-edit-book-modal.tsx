"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { Book } from "@/components/columns/books-columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const bookFormSchema = z.object({
  title: z.string().min(1, "Kitap adı zorunludur."),
  authorId: z.string({ required_error: "Yazar seçimi zorunludur." }),
  publisherId: z.string({ required_error: "Yayınevi seçimi zorunludur." }),
  categoryId: z.string().optional(),
  publishedYear: z.coerce.number().min(1000, "Geçerli bir yıl girin.").max(new Date().getFullYear(), "Gelecek bir yıl olamaz."),
  isbn: z.string().min(1, "ISBN zorunludur."),
  stock: z.coerce.number().min(0, "Stok negatif olamaz."),
  description: z.string().optional(),
  shelf_location: z.string().optional(),
});
type BookFormData = z.infer<typeof bookFormSchema>;

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
}

type PaginatedResponse<T> = { data: T[]; total: number; page: number; limit: number; };
type SelectItemData = { id: string; name: string };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export function AddEditBookModal({ isOpen, onClose, book }: AddEditBookModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!book;

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      isbn: "",
      publishedYear: new Date().getFullYear(),
      stock: 1,
      description: "",
      shelf_location: "",
      authorId: undefined,
      publisherId: undefined,
      categoryId: undefined,
    },
  });

  useEffect(() => {
    if (isEditMode && book) {
      form.reset({
        title: book.title,
        isbn: book.isbn || "",
        publishedYear: book.publishedYear || new Date().getFullYear(),
        stock: book.totalCopies,
        authorId: book.author?.id,
        publisherId: book.publisher?.id,
        categoryId: book.category?.id,
        description: "", // Add description from book if available
        shelf_location: book.shelf_location || "",
      });
    } else {
      form.reset(form.formState.defaultValues);
    }
  }, [book, isEditMode, form]);

  const fetcher = async ({ pageParam = 1 }, endpoint: "authors" | "publishers" | "categories") =>
    (await api[endpoint].get({ query: { page: pageParam, limit: 10 } })).data as PaginatedResponse<SelectItemData>;

  const { data: authorsData, fetchNextPage: fetchNextAuthors, hasNextPage: hasNextAuthors, isFetchingNextPage: isFetchingAuthors } = useInfiniteQuery({
    queryKey: ["authors"],
    queryFn: (context) => fetcher(context, "authors"),
    getNextPageParam: (lastPage) => lastPage && lastPage.data.length === lastPage.limit ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
  
  const {
    data: publishersData,
    fetchNextPage: fetchNextPublishers,
    hasNextPage: hasNextPublishers,
    isFetchingNextPage: isFetchingPublishers,
  } = useInfiniteQuery({
    queryKey: ["publishers"],
    queryFn: (context) => fetcher(context, "publishers"),
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.data.length === lastPage.limit ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

  const {
    data: categoriesData,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasNextCategories,
    isFetchingNextPage: isFetchingCategories,
  } = useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: (context) => fetcher(context, "categories"),
    getNextPageParam: (lastPage) =>
      lastPage && lastPage.data.length === lastPage.limit ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
  
  const bookMutation = useMutation({
    mutationFn: (values: BookFormData) => {
      const payload = {
        title: values.title,
        author_id: values.authorId,
        publisher_id: values.publisherId,
        category_id: values.categoryId,
        published_year: values.publishedYear,
        isbn: values.isbn,
        total_copies: values.stock,
        available_copies: values.stock, // Initially, all copies are available
        description: values.description,
        shelf_location: values.shelf_location,
      };

      const apiCall = isEditMode && book
        ? api.books({ id: book.id }).put(payload)
        : api.books.post(payload);
      return apiCall;
    },
    onSuccess: (result: any) => {
      if (result.error) {
        toast.error(`Bir hata oluştu: ${result.error.value.message || result.error.value}`);
        return;
      }
      toast.success(isEditMode ? "Kitap başarıyla güncellendi!" : "Kitap başarıyla eklendi!");
      queryClient.invalidateQueries({ queryKey: ["books"] });
      onClose();
    },
    onError: (error) => {
      toast.error(`Bir ağ hatası oluştu: ${error.message}`);
    },
  });

  const onSubmit = (data: BookFormData) => bookMutation.mutate(data);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Kitap Düzenle" : "Yeni Kitap Ekle"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Kitap bilgilerini güncelleyin."
              : "Yeni bir kitabı kütüphaneye ekleyin."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kitap Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="örn: Suç ve Ceza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="örn: 978-605-332-901-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="authorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yazar</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir yazar seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {authorsData?.pages?.map((page, i) => (
                            <Fragment key={i}>
                              {page?.data?.map((author) => (
                                <motion.div key={author.id} variants={itemVariants}>
                                  <SelectItem value={author.id}>{author.name}</SelectItem>
                                </motion.div>
                              ))}
                            </Fragment>
                          ))}
                        </motion.div>
                        {hasNextAuthors && (
                          <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onClick={() => fetchNextAuthors()}
                            disabled={isFetchingAuthors}
                          >
                            {isFetchingAuthors ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
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
                name="publisherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yayınevi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir yayınevi seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {publishersData?.pages?.map((page, i) => (
                            <Fragment key={i}>
                              {page?.data?.map((publisher) => (
                                <motion.div key={publisher.id} variants={itemVariants}>
                                  <SelectItem value={publisher.id}>{publisher.name}</SelectItem>
                                </motion.div>
                              ))}
                            </Fragment>
                          ))}
                        </motion.div>
                        {hasNextPublishers && (
                          <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onClick={() => fetchNextPublishers()}
                            disabled={isFetchingPublishers}
                          >
                            {isFetchingPublishers ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
                          </Button>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori (Opsiyonel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir kategori seçin..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <motion.div
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {categoriesData?.pages?.map((page, i) => (
                            <Fragment key={i}>
                              {page?.data?.map((category) => (
                                <motion.div key={category.id} variants={itemVariants}>
                                  <SelectItem value={category.id}>{category.name}</SelectItem>
                                </motion.div>
                              ))}
                            </Fragment>
                          ))}
                        </motion.div>
                        {hasNextCategories && (
                          <Button
                            className="w-full mt-2"
                            variant="ghost"
                            onClick={() => fetchNextCategories()}
                            disabled={isFetchingCategories}
                          >
                            {isFetchingCategories ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla Yükle"}
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
                name="publishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yayın Yılı</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Adedi</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="shelf_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raf Konumu (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input placeholder="örn: A-3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Kitap hakkında kısa bir açıklama..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={bookMutation.isPending}>
                İptal
              </Button>
              <Button type="submit" disabled={bookMutation.isPending}>
                {bookMutation.isPending ? "Kaydediliyor..." : isEditMode ? "Değişiklikleri Kaydet" : "Kitap Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 