"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";

interface PublishersToolbarProps<TData> {
  table: Table<TData>;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

export function PublishersToolbar<TData>({
  table,
  filterValue,
  setFilterValue,
}: PublishersToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Yayınevi adı ile ara..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button size="sm">
        Yeni Yayınevi Ekle
      </Button>
    </div>
  );
} 