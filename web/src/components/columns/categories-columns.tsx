"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/features/categories/components/data-table-row-actions";
import type { Category } from "@/features/categories/types";
import type { ColumnDef } from "@tanstack/react-table";

export const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.name}</span>
        <span className="text-sm text-muted-foreground">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "books",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kitap Sayısı" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.original._count.books} kitap</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]; 