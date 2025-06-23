"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";
import React from "react";

interface PublishersToolbarProps<TData> {
  table: Table<TData>;
  onSearch: (value: string) => void;
}

export function PublishersToolbar<TData>({
  table,
  onSearch,
}: PublishersToolbarProps<TData>) {
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Yayınevi adı ile ara..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Button size="sm" onClick={() => onSearch(searchValue)}>
          Ara
        </Button>
      </div>
      <Button size="sm">
        Yeni Yayınevi Ekle
      </Button>
    </div>
  );
} 