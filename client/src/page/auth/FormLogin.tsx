import { GoogleIcon } from '@/components/shared/IconJSX'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { loginValidation, TypeLoginValidation } from '@/lib/validate'
import { useLoginUser } from '@/services/query/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import ResendEmail from './components/ResendEmail'

export default function FormLogin() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<TypeLoginValidation>({
    resolver: zodResolver(loginValidation)
  })
  const [isVisible, setIsVisible] = useState(false)
  const { mutate: loginUser } = useLoginUser()

  const onSubmit = async (payload: TypeLoginValidation) => {
    loginUser(payload, {
      onSuccess: () => {
        reset()
      }
    })
  }
  return (
    <div className='relative z-10 flex flex-1 flex-col rounded-3xl border-white/50 border-t bg-white/60 px-4 py-10 backdrop-blur-2xl sm:justify-center md:flex-none md:px-20 lg:rounded-r-none lg:border-t-0 lg:border-l lg:py-24'>
      <div className='mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0'>
        <h1 className='font-semibold text-3xl text-neutral-900 tracking-tighter text-center'>
          Trello App <br />
        </h1>
        <p className='mt-4 font-medium text-base text-neutral-900 text-center px-8'>
          A simple and easy way to copy paste components from the web.
        </p>

        <div className='mt-8'>
          <Button
            className='inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 font-medium duration-200 hover:bg-white/50 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 text-black'
            type='button'
          >
            <GoogleIcon className='size-6' />
            <span>Sign in with Google</span>
          </Button>
          <div className='relative py-3'>
            <div className='relative flex justify-center'>
              <span className='before:-translate-y-1/2 after:-translate-y-1/2 px-2 text-sm before:absolute before:top-1/2 before:left-0 before:h-px before:w-4/12 after:absolute after:top-1/2 after:right-0 after:h-px after:w-4/12 sm:after:bg-neutral-300 sm:before:bg-neutral-300 text-gray-800'>
                Or continue with
              </span>
            </div>
          </div>
        </div>
        {/* ===== FORM ACCTION SUBMIT =======*/}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-3'>
            <div>
              <Label>Email</Label>
              <Input type='email' placeholder='Your email..' {...register('email')} isError={Boolean(errors.email)} />
              {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
            </div>
            <div className='col-span-full'>
              <Label> Password</Label>
              <div className='relative h-full'>
                <Input
                  type={isVisible ? 'text' : 'password'}
                  placeholder='Type password here...'
                  {...register('password')}
                  isError={Boolean(errors.password)}
                />
                <button
                  type='button'
                  onClick={() => setIsVisible((prev) => !prev)}
                  aria-label={isVisible ? 'Hide password' : 'Show password'}
                  className='absolute inset-y-0 right-0 outline-none flex items-center justify-center w-9 text-muted-foreground/80 hover:text-foreground  '
                >
                  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
            </div>

            <div className='col-span-full '>
              <Button type='submit' className='h-12 flex items-center justify-center w-full mt-5'>
                Login
              </Button>
              <ResendEmail />
            </div>
          </div>
          <div className='mt-6'>
            <p className='mx-auto flex text-center font-medium text-black text-sm leading-tight'>
              Not have a account?
              <Link to='/auth/register' className='ml-auto text-amber-800 hover:text-black'>
                Sign up now
              </Link>
            </p>
          </div>
        </form>
        {/* ===== END FORM ====== */}
      </div>
    </div>
  )
}
