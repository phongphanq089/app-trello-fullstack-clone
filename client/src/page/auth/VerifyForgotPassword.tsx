// pages/VerifyForgotPasswordPage.tsx
import { Button } from '@/components/ui/button'
import { TypeVerifyForgotPassValidation, verifyForgotPassValidation } from '@/lib/validate'
import { useForgotPasswordVerify } from '@/services/query/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { string } from 'zod'
import ResendPassword from './components/ResendPassword'

const VerifyForgotPassword = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<TypeVerifyForgotPassValidation>({
    resolver: zodResolver(verifyForgotPassValidation)
  })

  const { mutate: updatePassword, isSuccess } = useForgotPasswordVerify()

  const [searchParam] = useSearchParams()

  const email = searchParam.get('email') as string
  const token = searchParam.get('token') as string

  const onSubmit = async (payload: TypeVerifyForgotPassValidation) => {
    const PAYLOAD = {
      ...payload,
      email,
      token
    }
    updatePassword(PAYLOAD, {
      onSuccess: () => {
        reset()
      }
    })
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-8 rounded-xl shadow-xl max-w-md w-full space-y-6'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>Xác minh quên mật khẩu</h2>
        {isSuccess ? (
          <div className='flex items-center justify-center flex-col gap-3'>
            <p className='text-green-600 text-center'>Mật khẩu đã được thay đổi thành công!</p>
            <Link to='/auth/login'>
              <Button>Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Mật khẩu mới</label>
              <input
                type='password'
                {...register('password')}
                placeholder='******'
                className='mt-1 w-full px-4 py-2 border rounded-lg'
              />
              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
            </div>
            <button
              type='submit'
              className='w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition'
            >
              Đổi mật khẩu
            </button>
            <ResendPassword />
          </form>
        )}
      </div>
    </div>
  )
}

export default VerifyForgotPassword
