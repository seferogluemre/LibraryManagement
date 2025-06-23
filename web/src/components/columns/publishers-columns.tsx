"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "@/features/publishers/components/data-table-row-actions";
import { type Publisher } from "@/features/publishers/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Building2 } from "lucide-react";

type GetColumnsOptions = {
  onEdit: (publisher: Publisher) => void;
  onDelete: (publisher: Publisher) => void;
};

export const getColumns = ({
  onEdit,
  onDelete,
}: GetColumnsOptions): ColumnDef<Publisher>[] => [
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
    accessorKey: "books",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kitap Sayısı" />
    ),
    cell: ({ row }) => {
      const bookCount = row.original.books.length;
      return <Badge variant="outline">{bookCount} kitap</Badge>;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.books.length - rowB.original.books.length;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onEdit={() => onEdit(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
]; 