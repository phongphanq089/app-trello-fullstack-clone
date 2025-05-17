import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerValidation, TypeRisterValidation } from '@/lib/validate'
import { Eye, EyeOff, Loader2, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterUser } from '@/services/query/auth'
import { toast } from 'react-toastify'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const FormRegister = () => {
  const [isVisible, setIsVisible] = useState(false)

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm<TypeRisterValidation>({
    resolver: zodResolver(registerValidation)
  })

  const { mutate: registerUser, isPending } = useRegisterUser()

  const [emailVeriry, setEmailVerify] = useState(false)

  const [nameEmail, setNameEmail] = useState('')

  const onSubmit = async (payload: TypeRisterValidation) => {
    registerUser(payload, {
      onSuccess: (data) => {
        setEmailVerify(true)
        setNameEmail(data.result.email)
        toast.success('Register successfully')
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

        {emailVeriry ? (
          <Alert className='my-4 bg-yellow-300/40'>
            <Terminal className='h-4 w-4' />
            <AlertTitle>An email has been sent to {nameEmail}</AlertTitle>
            <AlertDescription>Please check and verify your account before logging in!</AlertDescription>
          </Alert>
        ) : (
          ''
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-3'>
            <div>
              <Label>User name</Label>
              <Input
                type='text'
                placeholder='Your name...'
                {...register('username')}
                isError={Boolean(errors.username)}
              />
              {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
            </div>
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
              <Label>Confirm Password</Label>
              <div className='relative h-full'>
                <Input
                  type={isVisible ? 'text' : 'password'}
                  placeholder='Confirm Password...'
                  {...register('confirmPwd')}
                  isError={Boolean(errors.confirmPwd)}
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
              {errors.confirmPwd && <p className='text-red-500 text-sm mt-1'>{errors.confirmPwd.message}</p>}
            </div>
            <div className='col-span-full '>
              <Button type='submit' className='h-12 flex items-center justify-center w-full mt-5' disabled={isPending}>
                {isPending && <Loader2 className='animate-spin' />}
                Sign Up
              </Button>
            </div>
          </div>
          <div className='mt-6'>
            <p className='mx-auto flex text-center font-medium text-black text-sm leading-tight'>
              Not have a password?
              <Link to='/auth/login' className='ml-auto text-amber-800 hover:text-black'>
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormRegister
