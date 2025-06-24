"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";
import React from "react";

interface PublishersToolbarProps<TData> {
  table: Table<TData>;
  onSearch: (value: string) => void;
  onAdd: () => void;
}

export function PublishersToolbar<TData>({
  table,
  onSearch,
  onAdd,
}: PublishersToolbarProps<TData>) {
  const [searchValue, setSearchValue] = React.useState(
    (table.getColumn("name")?.getFilterValue() as string) ?? ""
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(searchValue);
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchValue, onSearch]);

  React.useEffect(() => {
    setSearchValue((table.getColumn("name")?.getFilterValue() as string) ?? "");
  }, [table.getColumn("name")?.getFilterValue()]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Yayınevi adı ile ara..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <Button size="sm" onClick={onAdd}>
        Yeni Yayınevi Ekle
      </Button>
    </div>
  );
} 