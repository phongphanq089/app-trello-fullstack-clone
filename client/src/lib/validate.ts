import { z } from 'zod'

const fields = {
  username: z.string().min(3).optional(),
  email: z.string().email({
    message: 'Please enter valid email address'
  }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: 'Password must include at least one number or special character'
    })
}

export const registerValidation = z
  .object({
    username: fields.username,
    email: fields.email,
    password: fields.password,
    confirmPwd: z.string()
  })
  .refine((data) => data.password === data.confirmPwd, {
    path: ['confirmPwd'],
    message: 'Passwords do not match'
  })

export const loginValidation = z.object({
  email: fields.email,
  password: fields.password
})

export const verifyForgotPassValidation = z.object({
  password: fields.password
})

export const resendEmailValidation = z.object({
  emailResend: fields.email
})

export type TypeRisterValidation = z.infer<typeof registerValidation>

export type TypeLoginValidation = z.infer<typeof loginValidation>

export type TypeResendEmail = z.infer<typeof resendEmailValidation>

export type TypeVerifyForgotPassValidation = z.infer<typeof verifyForgotPassValidation>
