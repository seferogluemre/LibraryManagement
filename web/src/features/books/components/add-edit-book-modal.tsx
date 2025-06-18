"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Fragment, useEffect } from "react";
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
import { Loader2 } from "lucide-react";

import type { Book } from "@/components/columns/books-columns";
import { api } from "@/lib/api";

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

// Define a type for the paginated response to avoid using 'any'
type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
};

// Define a specific type for the items in the select lists
type SelectItemData = { id: string; name: string };

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05, // This creates the staggered effect
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

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
                isbn: book.isbn || "",
                publishedYear: book.publishedYear || new Date().getFullYear(),
                stock: book.totalCopies,
                authorId: book.author.id,
                publisherId: book.publisher?.id,
                categoryId: book.category?.id,
                description: "",
            });
        } else {
            form.reset();
        }
    }, [book, isEditMode, form]);

    const {
        data: authorsData,
        fetchNextPage: fetchNextAuthors,
        hasNextPage: hasNextAuthors,
        isFetchingNextPage: isFetchingAuthors,
    } = useInfiniteQuery({
        queryKey: ["authors"],
        queryFn: async ({ pageParam = 1 }) =>
            (await api.authors.get({ query: { page: pageParam, limit: 10 } })).data as PaginatedResponse<SelectItemData>,
        getNextPageParam: (lastPage: PaginatedResponse<SelectItemData> | undefined) => {
            if (!lastPage) return undefined;
            const morePagesExist = lastPage.data.length === lastPage.limit;
            return morePagesExist ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const {
        data: publishersData,
        fetchNextPage: fetchNextPublishers,
        hasNextPage: hasNextPublishers,
        isFetchingNextPage: isFetchingPublishers,
    } = useInfiniteQuery({
        queryKey: ["publishers"],
        queryFn: async ({ pageParam = 1 }) =>
            (await api.publishers.get({ query: { page: pageParam, limit: 10 } })).data as PaginatedResponse<SelectItemData>,
        getNextPageParam: (lastPage: PaginatedResponse<SelectItemData> | undefined) => {
            if (!lastPage) return undefined;
            const morePagesExist = lastPage.data.length === lastPage.limit;
            return morePagesExist ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
    });

    const {
        data: categoriesData,
        fetchNextPage: fetchNextCategories,
        hasNextPage: hasNextCategories,
        isFetchingNextPage: isFetchingCategories,
    } = useInfiniteQuery({
        queryKey: ["categories"],
        queryFn: async ({ pageParam = 1 }) =>
            (await api.categories.get({ query: { page: pageParam, limit: 10 } })).data as PaginatedResponse<SelectItemData>,
        getNextPageParam: (lastPage: PaginatedResponse<SelectItemData> | undefined) => {
            if (!lastPage) return undefined;
            const morePagesExist = lastPage.data.length === lastPage.limit;
            return morePagesExist ? lastPage.page + 1 : undefined;
        },
        initialPageParam: 1,
    });
    
    const bookMutation = useMutation({
        mutationFn: (values: BookFormData) => {
            const payload = { ...values, stock: Number(values.stock) };
            if (isEditMode && book) {
                console.log("UPDATING BOOK (SCENARIO):", book.id, payload);
                return Promise.resolve();
            } else {
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