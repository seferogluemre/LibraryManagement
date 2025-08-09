"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditStudentForm } from "@/features/students/components/EditStudentForm";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  MoreHorizontal,
  Trash
} from "lucide-react";
import React from "react";
import { toast } from "sonner";

export type Student = {
  id: string;
  name: string;
  studentNo: string;
  class: {
    id: string;
    name: string;
  };
  email: string | null; // email nullable olabilir
  borrowedBooks: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Ad Soyad",
  },
  {
    accessorKey: "studentNo",
    header: "Öğrenci No",
  },
  {
    accessorKey: "class",
    header: "Sınıf",
    cell: ({ row }) => row.original.class.name,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<any>(id).name);
    },
  },
  {
    accessorKey: "email",
    header: "E-posta",
  },
  
  {
    id: "actions",
    header: "İşlemler",
    cell: function Cell({ row }) {
      const student = row.original;
      const router = useRouter();
      const queryClient = useQueryClient();
      const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
      const [showEditDialog, setShowEditDialog] = React.useState(false);

      const { mutate: deleteStudent, isPending: isDeleting } = useMutation({
        mutationFn: async (studentId: string) => {
          const res = await api.students[":id"].delete({ params: { id: studentId } });
          if (res.error) throw new Error(res.error.value.message);
          return res.data;
        },
        onSuccess: () => {
          toast.success("Öğrenci başarıyla silindi.");
          queryClient.invalidateQueries({ queryKey: ["students"] });
        },
        onError: (error) => toast.error(error.message),
        onSettled: () => setShowDeleteDialog(false),
      });

      const handleViewDetails = () => {
        router.navigate({ to: `/students/$studentId`, params: { studentId: student.id } });
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
              <DropdownMenuItem onSelect={handleViewDetails}>
                <Eye className="mr-2 h-4 w-4" />
                Detayları Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onSelect={() => setShowDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" /> Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteStudent(student.id)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? "Siliniyor..." : "Evet, Sil"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <EditStudentForm
            student={student}
            isOpen={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      );
    },
  },
];
