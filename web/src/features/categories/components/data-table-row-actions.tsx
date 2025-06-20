"use client";

import type { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "../types";

interface DataTableRowActionsProps {
  row: Row<Category>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const category = row.original;

  return (
    <>
      {/* TODO: Add logic for edit modal and delete dialog */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Menüyü aç</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Düzenle</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Sil</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 