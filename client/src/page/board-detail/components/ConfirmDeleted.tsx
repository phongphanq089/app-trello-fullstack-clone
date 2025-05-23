import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { RiErrorWarningFill } from '@remixicon/react'

interface PropsTypes {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleRemoveColumn: () => void
}

export default function ConfirmDeleted({ open, setOpen, handleRemoveColumn }: PropsTypes) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <div className='flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4'>
          <div className='flex size-9 shrink-0 items-center justify-center rounded-full border' aria-hidden='true'>
            <RiErrorWarningFill className='opacity-80' size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this column? All your data will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveColumn}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
