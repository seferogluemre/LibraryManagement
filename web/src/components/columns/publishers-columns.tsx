"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/features/publishers/components/data-table-row-actions";
import { type Publisher } from "@/features/publishers/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

export const columns: ColumnDef<Publisher>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Yayınevi Adı" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "_count.books",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kitap Sayısı" />
    ),
    cell: ({ row }) => {
      const bookCount = row.original._count.books;
      return <Badge variant="outline">{bookCount} kitap</Badge>;
    },
  },
  {
    accessorKey: "establishmentYear",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kuruluş Yılı" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue("establishmentYear")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]; 