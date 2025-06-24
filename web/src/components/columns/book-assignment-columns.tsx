"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type BookAssignment } from "@/features/assignments/types"
import { api } from "@/lib/api"
import { handleServerError } from "@/utils/handle-server-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { toast } from "sonner"

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
      let variant: "default" | "destructive" | "secondary" | "outline" | null | undefined = "secondary";
      
      if (status === "Gecikmiş") {
        variant = "destructive"
      } else if (status === "İade Edildi") {
        variant = "default"
      }

      if (status === "İade Edildi") {
        return <Badge className="bg-green-600 text-white">{status}</Badge>
      }

      if (status === "Ödünç Verildi") {
        return <Badge className="bg-orange-500 text-white">{status}</Badge>
      }

      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    header: "İşlemler",
    cell: function Cell({ row }) {
      const assignment = row.original
      const isReturned = assignment.status === "İade Edildi"
      const queryClient = useQueryClient()

      const returnBookMutation = useMutation({
        mutationFn: async (assignmentId: string) => {
          const res = await api["book-assignments"][assignmentId].return.patch(
            {}
          )
          if (res.error) {
            throw res.error
          }
          return res.data
        },
        onSuccess: () => {
          toast.success("Kitap başarıyla iade alındı.")
          queryClient.invalidateQueries({ queryKey: ["assignments"] })
          queryClient.invalidateQueries({ queryKey: ["assignments-stats"] })
        },
        onError: (error) => {
          handleServerError(error)
        },
      })

      if (isReturned) {
        return null
      }

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => returnBookMutation.mutate(assignment.id)}
          disabled={returnBookMutation.isPending}
        >
          {returnBookMutation.isPending ? "İade ediliyor..." : "İade Al"}
        </Button>
      )
    },
  },
] 