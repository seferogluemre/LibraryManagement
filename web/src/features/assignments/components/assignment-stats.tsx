"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AssignmentStatsProps {
  active: number
  overdue: number
  returnedThisMonth: number
}

export function AssignmentStats({
  active,
  overdue,
  returnedThisMonth,
}: AssignmentStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktif Ödünç</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{active}</div>
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
          <div className="text-2xl font-bold text-destructive">{overdue}</div>
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
          <div className="text-2xl font-bold">{returnedThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Bu ay içinde iade edilen kitap sayısı
          </p>
        </CardContent>
      </Card>
    </div>
  )
}