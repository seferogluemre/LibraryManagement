 
"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Type definition updated to match the new API response structure.
export type TransferHistoryRow = {
  id: string
  student: { id: string; name: string }
  oldClass: { id: string; name: string } | string
  newClass: { id: string; name: string } | string
  transferDate: string
  reason: string
  // Assuming 'createdBy' will be added to the API response
  createdBy?: { name: string; role: string }
  notes?: string
}

const renderClass = (classData: { id: string; name: string } | string) => {
    if (typeof classData === 'object' && classData !== null) {
        return classData.name;
    }
    return classData;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export const columns: ColumnDef<TransferHistoryRow>[] = [
  {
    accessorKey: "student",
    header: "Öğrenci",
    cell: ({ row }) => row.original.student.name,
  },
  {
    accessorKey: "oldClass",
    header: "Eski Sınıf",
    cell: ({ row }) => <Badge variant="outline">{renderClass(row.original.oldClass)}</Badge>
  },
  {
    accessorKey: "newClass",
    header: "Yeni Sınıf",
    cell: ({ row }) => <Badge>{renderClass(row.original.newClass)}</Badge>
  },
  {
    accessorKey: "transferDate",
    header: "Transfer Tarihi",
    cell: ({ row }) => formatDate(row.original.transferDate)
  },
  {
    accessorKey: "reason",
    header: "Sebep",
    cell: ({ row }) => <Badge variant="secondary">{row.original.notes}</Badge>
  },
  {
    accessorKey: "createdBy",
    header: "İşlemi Yapan",
    cell: ({ row }) => {
        const user = row.original.createdBy;
        if (!user) return <span className="text-muted-foreground">N/A</span>;
        // Capitalize role and format the name
        const role = user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
        return `${role} ${user.name}`;
    }
  },
  {
    accessorKey: "notes",
    header: "Notlar",
    cell: ({ row }) => row.original.notes || <span className="text-muted-foreground">Not yok</span>,
  },
  {
    id: "actions",
    header: "Eylemler",
    cell: ({ row }) => <DeleteAction row={row.original} />,
  },
]

// eslint-disable-next-line react-refresh/only-export-components
function DeleteAction({ row }: { row: TransferHistoryRow }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api["transfer-history"]({ id }).delete();
      if (res.error) {
        throw new Error(res.error.value);
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Transfer kaydı başarıyla silindi.");
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Kayıt silinirken bir hata oluştu: ${error.message}`);
      setIsDialogOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(row.id);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu transfer kaydını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Siliniyor..." : "Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 