import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resendEmailValidation, TypeResendEmail } from '@/lib/validate'
import { useResendEmail } from '@/services/query/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ResendEmail = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<TypeResendEmail>({
    resolver: zodResolver(resendEmailValidation)
  })

  const [open, setOpen] = React.useState(false)

  const { mutate: resendEmail } = useResendEmail()

  const onSubmit = async (payload: TypeResendEmail) => {
    resendEmail(payload.emailResend, {
      onSuccess: () => {
        reset()
        toast.success('Resend Email success !')
        setOpen(false)
      }
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className='cursor-pointer underline underline-offset-1 text-center flex justify-center items-center mt-5'>
          Resend Email
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Resend email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-3'>
            <div>
              <Label>Email</Label>
              <Input
                type='email'
                placeholder='Your email..'
                {...register('emailResend')}
                isError={Boolean(errors.emailResend)}
              />
              {errors.emailResend && <p className='text-red-500 text-sm mt-1'>{errors.emailResend.message}</p>}
            </div>

            <div className='col-span-full '>
              <Button type='submit' className='h-12 flex items-center justify-center w-full mt-5'>
                Resend Email
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ResendEmail
