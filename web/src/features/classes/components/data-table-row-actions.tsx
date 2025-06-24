"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Class } from "@/routes/_authenticated/classes";
import { useState } from "react";
import { AddEditClassroomModal } from "./AddEditClassroomModal";
import { DeleteClassDialog } from "./delete-class-dialog";

interface ClassDataTableRowActionsProps {
  row: Row<Class>;
}

export function ClassDataTableRowActions({
  row,
}: ClassDataTableRowActionsProps) {
  const classroom = row.original;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <AddEditClassroomModal
        classroom={classroom}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Menüyü aç</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteClassDialog classId={classroom.id} className={classroom.name} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 