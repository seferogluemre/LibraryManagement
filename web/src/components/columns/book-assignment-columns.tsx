"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type BookAssignment } from "@/features/assignments/types"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<BookAssignment>[] = [
  {
    accessorKey: "bookName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kitap Adı
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "studentName",
    header: "Öğrenci",
  },
  {
    accessorKey: "className",
    header: "Sınıf",
  },
  {
    accessorKey: "assignedDate",
    header: "Veriliş Tarihi",
  },
  {
    accessorKey: "dueDate",
    header: "İade Tarihi",
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant =
        status === "Gecikmiş"
          ? "destructive"
          : status === "İade Edildi"
            ? "default"
            : "secondary"

      if (status === "İade Edildi") {
        return <Badge variant="outline">{status}</Badge>
      }

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: ({ row }) => {
      const assignment = row.original
      const isReturned = assignment.status === 'İade Edildi'

      if (isReturned) {
        return null;
      }

      return (
        <Button variant="outline" size="sm">
          İade Al
        </Button>
      )
    },
  },
] 