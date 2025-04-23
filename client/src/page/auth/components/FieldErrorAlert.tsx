import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

interface FieldNameType {
  message?: string
}
interface propType {
  errors: Record<string, FieldNameType>
  fieldName: string
}

function FieldErrorAlert({ errors, fieldName }: propType) {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert>
      <Terminal className='h-4 w-4' />
      <AlertTitle>{fieldName}!</AlertTitle>
      <AlertDescription>{errors[fieldName]?.message}</AlertDescription>{' '}
    </Alert>
  )
}

export default FieldErrorAlert
