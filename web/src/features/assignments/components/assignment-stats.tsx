"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type BookAssignment } from "@/features/assignments/types"

interface AssignmentStatsProps {
  data: BookAssignment[]
}

export function AssignmentStats({ data }: AssignmentStatsProps) {
  const stats = {
    active: data.filter((item) => item.status === "Ödünç Verildi").length,
    overdue: data.filter((item) => item.status === "Gecikmiş").length,
    returnedThisMonth: data.filter((item) => {
      if (item.status !== "İade Edildi" || !item.returnDate) return false
      const returnDate = new Date(item.returnDate)
      const today = new Date()
      return (
        returnDate.getMonth() === today.getMonth() &&
        returnDate.getFullYear() === today.getFullYear()
      )
    }).length,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktif Ödünç</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">
            Şu an öğrencilere ödünç verilmiş kitap sayısı
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gecikmiş</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
          <p className="text-xs text-muted-foreground">
            İade tarihi geçmiş kitap sayısı
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bu Ay İade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.returnedThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Bu ay içinde iade edilen kitap sayısı
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 