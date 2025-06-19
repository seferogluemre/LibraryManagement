"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type Author = {
  id: string;
  name: string;
  bookCount: number;
  avatarUrl?: string;
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials;
}

export const columns: ColumnDef<Author>[] = [
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
    cell: ({ row }) => <Badge variant="secondary">{row.original.bookCount} kitap</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
       // Actions will be added later
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Menüyü aç</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    },
  },
]; 