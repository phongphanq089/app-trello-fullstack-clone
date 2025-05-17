import { Button } from '@/components/ui/button'
import { useVerifyUser } from '@/services/query/auth'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const { mutate, isPending, isSuccess, isError } = useVerifyUser()

  useEffect(() => {
    if (email && token) {
      mutate({ email, token })
    }
  }, [email, token])

  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white rounded-2xl shadow-lg p-8 max-w-md text-center space-y-4'>
        {isPending && (
          <>
            <Loader2 className='w-10 h-10 mx-auto animate-spin text-blue-500' />
            <h2 className='text-lg font-semibold text-gray-700'>Đang xác minh email của bạn...</h2>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle2 className='w-12 h-12 mx-auto text-green-500' />
            <h2 className='text-xl font-bold text-green-600'>Xác minh thành công!</h2>
            <p className='text-gray-600'>Bạn có thể tiếp tục đăng nhập ngay bây giờ.</p>
            <Button onClick={() => navigate('/auth/login')}>Login</Button>
          </>
        )}

        {isError && (
          <>
            <XCircle className='w-12 h-12 mx-auto text-red-500' />
            <h2 className='text-xl font-bold text-red-600'>Xác minh thất bại!</h2>
            <p className='text-gray-600'>Liên kết có thể đã hết hạn hoặc không hợp lệ.</p>
            <Button onClick={() => navigate('/auth/login')}>Login</Button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
