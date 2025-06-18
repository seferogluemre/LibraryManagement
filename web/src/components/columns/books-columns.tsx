"use client";

import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Book = {
  id: string;
  title: string;
  author: {
    name: string;
  };
  category: {
    name: string;
  } | null;
  publisher: {
    name: string;
  } | null;
  totalCopies: number;
  availableCopies: number;
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "title",
    header: "Kitap Adı",
  },
  {
    accessorKey: "author",
    header: "Yazar",
    cell: ({ row }) => row.original.author.name,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      const category = row.original.category;
      return category ? (
        <Badge variant="outline">{category.name}</Badge>
      ) : (
        <span className="text-muted-foreground">Kategorisiz</span>
      );
    },
  },
  {
    accessorKey: "publisher",
    header: "Yayınevi",
    cell: ({ row }) => row.original.publisher?.name || <span className="text-muted-foreground">Bilinmiyor</span>,
  },
  {
    accessorKey: "totalCopies",
    header: "Toplam Kopya",
  },
  {
    accessorKey: "availableCopies",
    header: "Mevcut Kopya",
    cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.availableCopies}</Badge>
    }
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => {
      // We will add a dropdown menu here later
      return <span>...</span>;
    },
  },
]; 