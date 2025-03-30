import { Columns } from '@/types/Board'
import { cva } from 'class-variance-authority'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max text-white items-center justify-center rounded-md bg-color-1 px-4 py-2 text-sm font-medium transition-colors hover:bg-color-2  focus:bg-color-2 focus:text-white focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-color-2/50 data-[state=open]:bg-color-2/50'
)

export const mapOrder = (originalArray: Columns[] | null, orderArray: string[] | null, key: string) => {
  if (!originalArray || !orderArray || !key) return []

  const cloneArray = [...originalArray]

  const orderedArray = cloneArray.sort((a: any, b: any) => {
    return orderArray.indexOf(a[key]) - orderArray.indexOf(b[key])
  })

  return orderedArray
}
