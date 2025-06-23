"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Search } from "lucide-react"

export function AssignmentsToolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Kitap adı veya öğrenci adı ile ara..." className="pl-8" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="show-overdue" />
          <Label htmlFor="show-overdue" className="whitespace-nowrap">
            Sadece Gecikenleri Göster
          </Label>
        </div>
      </div>
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Yeni Kitap Ödünç Ver
      </Button>
    </div>
  )
} 