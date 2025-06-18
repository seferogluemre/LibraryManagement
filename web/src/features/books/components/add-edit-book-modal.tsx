"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Button
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Textarea
} from "@/components/ui/textarea";

import type { Book } from "@/components/columns/books-columns";
import { api } from "@/lib/api";
import { useEffect } from "react";

// Validation schema
const bookFormSchema = z.object({
    title: z.string().min(1, "Kitap adı zorunludur."),
    authorId: z.string({ required_error: "Yazar seçimi zorunludur." }),
    publisherId: z.string({ required_error: "Yayınevi seçimi zorunludur." }),
    categoryId: z.string().optional(),
    publishedYear: z.coerce.number().min(1000, "Geçerli bir yıl girin.").max(new Date().getFullYear(), "Gelecek bir yıl olamaz."),
    isbn: z.string().min(1, "ISBN zorunludur."),
    stock: z.coerce.number().min(0, "Stok negatif olamaz."),
    description: z.string().optional(),
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface AddEditBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    book?: Book | null;
}

export function AddEditBookModal({
    isOpen,
    onClose,
    book,
}: AddEditBookModalProps) {
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
            authorId: undefined,
            publisherId: undefined,
            categoryId: undefined,
        }
    });

    // Populate form with book data in edit mode
    useEffect(() => {
        if (isEditMode && book) {
            form.reset({
                title: book.title,
                isbn: book.id, // Assuming book.id is the ISBN for now
                publishedYear: book.totalCopies, // Placeholder, needs correct field
                stock: book.totalCopies,
                authorId: book.author.name, // Placeholder, needs id
                publisherId: book.publisher?.name, // Placeholder, needs id
                categoryId: book.category?.name, // Placeholder, needs id
                description: "", // Add description field if available
            });
        } else {
            form.reset(form.formState.defaultValues);
        }
    }, [book, isEditMode, form]);

    const { data: authors } = useQuery({
        queryKey: ["authors"],
        queryFn: async () => (await api.authors.get()).data,
    });

    const { data: publishers } = useQuery({
        queryKey: ["publishers"],
        queryFn: async () => (await api.publishers.get()).data,
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => (await api.categories.get()).data,
    });
    
    const bookMutation = useMutation({
        mutationFn: (values: BookFormData) => {
            const payload = { ...values };
            if (isEditMode && book) {
                // This is a scenario, so we're not calling the real update endpoint
                console.log("UPDATING BOOK (SCENARIO):", book.id, payload);
                return Promise.resolve(); 
            } else {
                // Scenario for creating a book
                console.log("CREATING BOOK (SCENARIO):", payload);
                return Promise.resolve();
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "Kitap başarıyla güncellendi!" : "Kitap başarıyla eklendi!");
            queryClient.invalidateQueries({ queryKey: ["books"] });
            onClose();
        },
        onError: (error) => {
            toast.error(`Bir hata oluştu: ${error.message}`);
        },
    });

    const onSubmit = (data: BookFormData) => {
        bookMutation.mutate(data);
    };

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
                                                {authors?.map((author: any) => (
                                                    <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                                                ))}
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
                                                {publishers?.map((publisher: any) => (
                                                    <SelectItem key={publisher.id} value={publisher.id}>{publisher.name}</SelectItem>
                                                ))}
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
                                                {categories?.map((category: any) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                                                ))}
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