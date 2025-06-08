import { useConfirmationDialog } from '#store/use-confirmation-dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './alert-dialog'

export function ConfirmationDialog() {
  const {
    isOpen,
    title,
    description,
    approveText,
    rejectText,
    onApprove,
    onReject,
    hide,
  } = useConfirmationDialog()

  const handleApprove = async () => {
    try {
      await onApprove?.()
    } finally {
      hide()
    }
  }

  const handleReject = async () => {
    try {
      await onReject?.()
    } finally {
      hide()
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleReject}>
            {rejectText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleApprove}>
            {approveText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 