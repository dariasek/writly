import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import React, { MouseEvent } from 'react'

interface ConfirmModalProps {
    children: React.ReactNode,
    onConfirm: () => void,
}

const ConfirmModal = (
    {
        children,
        onConfirm,
    }: ConfirmModalProps
) => {

    const handleConfirm = (e: MouseEvent) => {
        e.stopPropagation()
        onConfirm()
    }
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={e => e.stopPropagation()}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                    Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal