"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export type Student = {
  id: string;
  name: string;
  studentNo: string;
  class: {
    id: string;
    name: string;
  };
  email: string;
  borrowedBooks: number;
};

// 2. Kolon Tanımları
// Bu, tablomuzun kolonlarını tanımlayan ana yapıdır. Her bir obje, bir sütunu temsil eder.
export const columns: ColumnDef<Student>[] = [
  // "Ad Soyad" kolonu
  {
    accessorKey: "name", // 3. Hangi veriyi gösterecek? (Student objesindeki 'name' alanı)
    header: "Ad Soyad", // 4. Sütun başlığında ne yazacak?
  },
  // "Öğrenci No" kolonu
  {
    accessorKey: "studentNo",
    header: "Öğrenci No",
  },
  // "Sınıf" kolonu
  {
    accessorKey: "class",
    header: "Sınıf",
    cell: ({ row }) => {
      const className = row.original.class.name;
      return <span>{className}</span>;
    },
  },
  // "E-posta" kolonu
  {
    accessorKey: "email",
    header: "E-posta",
  },
  // "Ödünç Kitap" kolonu
 
  // "İşlemler" kolonu
  {
    header: "İşlemler",
    id: "actions", // 6. Benzersiz ID (Veriyle direkt bağlı olmadığı için)
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(student.id)}
              >
                Detayları Görüntüle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Düzenle</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
