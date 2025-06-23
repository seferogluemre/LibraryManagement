"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface PublishersToolbarProps<TData> {
  table: Table<TData>;
}

export function PublishersToolbar<TData>({
  table,
}: PublishersToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Yayınevi adı ile ara..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button size="sm">
        Yeni Yayınevi Ekle
      </Button>
    </div>
  );
} 