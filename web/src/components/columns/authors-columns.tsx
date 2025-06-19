"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export type Author = {
  id: string;
  name: string;
  avatarUrl?: string;
  _count: {
    books: number;
  };
};

interface AuthorColumnsProps {
    onEdit: (author: Author) => void;
    onDelete: (author: Author) => void;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
}

export const columns = ({ onEdit, onDelete }: AuthorColumnsProps): ColumnDef<Author>[] => [
  {
    accessorKey: "name",
    header: "Yazar",
    cell: ({ row }) => {
      const author = row.original;
      return (
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={author.avatarUrl} alt={author.name} />
            <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{author.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "bookCount",
    header: "Kitap Sayısı",
    cell: ({ row }) => <Badge variant="secondary">{row.original._count.books} kitap</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const author = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(author)}>
              <Pencil className="mr-2 h-4 w-4" />
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-600"
              onClick={() => onDelete(author)}
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