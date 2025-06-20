"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import { AddEditCategoryModal } from "./add-edit-category-modal";

interface CategoriesToolbarProps<TData> {
  table: Table<TData>;
}

export function CategoriesToolbar<TData>({
  table,
}: CategoriesToolbarProps<TData>) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  return (
    <>
      <AddEditCategoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Kategori adı veya açıklama ile ara"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Yeni Kategori Ekle
        </Button>
      </div>
    </>
  );
} 