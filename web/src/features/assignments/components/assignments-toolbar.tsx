"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import React from "react"
import { AddBookAssignmentModal } from "./add-book-assignment-modal"

interface AssignmentsToolbarProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  showOverdueOnly: boolean
  setShowOverdueOnly: React.Dispatch<React.SetStateAction<boolean>>
}

export function AssignmentsToolbar({
  search,
  setSearch,
  showOverdueOnly,
  setShowOverdueOnly,
}: AssignmentsToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kitap adı veya öğrenci adı ile ara..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-overdue"
            checked={showOverdueOnly}
            onCheckedChange={(checked) => setShowOverdueOnly(Boolean(checked))}
          />
          <Label htmlFor="show-overdue" className="whitespace-nowrap">
            Sadece Gecikenleri Göster
          </Label>
        </div>
      </div>
      <AddBookAssignmentModal />
    </div>
  )
} 