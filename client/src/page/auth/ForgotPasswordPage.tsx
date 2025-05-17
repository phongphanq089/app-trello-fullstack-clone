// pages/ForgotPasswordPage.tsx
import { resendEmailValidation, TypeResendEmail } from '@/lib/validate'
import { useForgotPassword } from '@/services/query/auth'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const ForgotPasswordPage = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<TypeResendEmail>({
    resolver: zodResolver(resendEmailValidation)
  })

  const { mutate: resendEmail, isSuccess } = useForgotPassword()

  const onSubmit = async (payload: TypeResendEmail) => {
    resendEmail(payload.emailResend, {
      onSuccess: () => {
        reset()
        toast.success('Resend Email success !')
      }
    })
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-xl shadow-xl max-w-md w-full space-y-6'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>Quên mật khẩu</h2>
        {isSuccess ? (
          <p className='text-green-600 text-center'>Mã xác minh đã được gửi đến email của bạn!</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Email</label>
              <input
                type='email'
                placeholder='Your email..'
                {...register('emailResend')}
                className='mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {errors.emailResend && <p className='text-red-500 text-sm mt-1'>{errors.emailResend.message}</p>}
            </div>
            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
            >
              Gửi mã xác minh
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
