"use client";

import { Badge } from "@/components/ui/badge";
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
  class: string;
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
  },
  // "E-posta" kolonu
  {
    accessorKey: "email",
    header: "E-posta",
  },
  // "Ödünç Kitap" kolonu
  {
    accessorKey: "borrowedBooks",
    header: "Ödünç Kitap",
    // 5. Özel Hücre Tanımı ('cell')
    // Bu hücrenin içeriğini standart metin yerine özel bir bileşenle (Badge) oluşturuyoruz.
    cell: ({ row }) => {
      const borrowedCount = row.original.borrowedBooks;
      if (borrowedCount > 0) {
        return <Badge variant="secondary">{borrowedCount} kitap</Badge>;
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
  // "İşlemler" kolonu
  {
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
