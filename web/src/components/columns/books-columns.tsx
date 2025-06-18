"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

interface ColumnsProps {
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Book>[] => [
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
    cell: ({ row }) =>
      row.original.publisher?.name || (
        <span className="text-muted-foreground">Bilinmiyor</span>
      ),
  },
  {
    accessorKey: "totalCopies",
    header: "Toplam Kopya",
  },
  {
    accessorKey: "availableCopies",
    header: "Mevcut Kopya",
    cell: ({ row }) => {
      const available = row.original.availableCopies;
      return (
        <Badge variant={available > 0 ? "default" : "destructive"}>
          {available}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Menüyü aç</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log("View details for", book.id)}>
              <Eye className="mr-2 h-4 w-4" />
              Detayları Görüntüle
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(book)}>
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500 focus:text-red-600"
              onClick={() => onDelete(book)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 