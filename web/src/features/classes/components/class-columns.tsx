"use client";

import { Badge } from "@/components/ui/badge";
import type { Class } from "@/routes/_authenticated/classes";
import type { ColumnDef } from "@tanstack/react-table";
import { ClassDataTableRowActions } from "./data-table-row-actions";

export const classColumns: ColumnDef<Class>[] = [
  {
    accessorKey: "name",
    header: "Sınıf Adı",
  },
  {
    accessorKey: "studentCount",
    header: "Öğrenci Sayısı",
    cell: ({ row }) => {
        const count = row.original.studentCount;
        return <Badge variant="secondary">{count} öğrenci</Badge>;
      },
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => <ClassDataTableRowActions row={row} />,
  },
]; 