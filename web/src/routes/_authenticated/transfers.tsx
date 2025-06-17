import { TransferForm } from '@/features/transfer/components/TransferForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transfers')({
  component: TransferPage,
})

export function TransferPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Öğrenci Transferi</h1>
        <p className="text-muted-foreground">
          Öğrenciyi bir sınıftan diğerine transfer edin
        </p>
      </div>
      <TransferForm />
    </div>
  )
}