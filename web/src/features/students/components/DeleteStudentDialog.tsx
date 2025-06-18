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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Trash, XCircle } from "lucide-react";
import { toast } from "sonner";

interface DeleteStudentDialogProps {
  studentId: string;
  onOpenChange: (open: boolean) => void;
}

export function DeleteStudentDialog({
  studentId,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteStudent, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.students[":id"].delete({ id });
      if (res.error) throw new Error(res.error.value.message);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Öğrenci başarıyla silindi.", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      onOpenChange(false); // Dropdown menüyü kapatmak için
    },
    onError: (error) => {
      toast.error("Öğrenci silinemedi.", {
        description: error.message,
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onSelect={(e) => e.preventDefault()} // Bu önemli!
        >
          <Trash className="mr-2 h-4 w-4" />
          Sil
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu işlem geri alınamaz. Öğrenci kalıcı olarak silinecektir.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>İptal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteStudent(studentId)}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Siliniyor..." : "Evet, Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
