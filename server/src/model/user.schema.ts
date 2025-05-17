import z from 'zod'

export class userSchema {
  public static userRegistrationSchema = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: 'Password must include at least one number or special character'
      }),
    username: z.string().min(3).optional(),
    displayName: z.string().nullable().optional().default(null),
    avatar: z.string().url({ message: 'Avatar must be a valid URL.' }).nullable().optional().default(null),
    role: z
      .enum(['admin', 'client'], {
        message: `'Role must be either "admin" or "client".'`
      })
      .nullable()
      .optional()
      .default('client'),
    isActive: z.boolean().nullable().optional().default(false),
    verifyToken: z.string().nullable().optional().default(null),
    forgot_password_token: z.string().nullable().optional().default(null),
    forgot_password_token_expired_at: z.string().nullable().optional().default(null),
    verify_token_expired_at: z.string().nullable().optional().default(null),
    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().nullable().default(null),
    _destroy: z.boolean().nullable().optional().default(false)
  })
  public static userVerifyAccountSchema = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    }),
    token: z.string()
  })
  public static userLoginSchema = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: 'Password must include at least one number or special character'
      })
  })
  public static forgotPassword = z.object({
    email: z.string().email({
      message: 'email invalid address'
    }),
    urlRedirect: z.string().url()
  })
  public static verifyForgotPassword = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    }),
    token: z.string(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((password) => /[0-9!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: 'Password must include at least one number or special character'
      })
  })
  public static resendForgotPasswordToken = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    }),
    urlRedirect: z.string().url()
  })
  public static resendVerifyEmailToken = z.object({
    email: z.string().email({
      message: 'Please enter valid email address'
    })
  })
}

export type UserRegistrationSchema = z.infer<typeof userSchema.userRegistrationSchema>

export type UserVerifyAccountSchema = z.infer<typeof userSchema.userVerifyAccountSchema>

export type UserLoginSchema = z.infer<typeof userSchema.userLoginSchema>

export type ForgotPasswordSchema = z.infer<typeof userSchema.forgotPassword>

export type VerifyForgotPassword = z.infer<typeof userSchema.verifyForgotPassword>

export type ResendForgotPasswordToken = z.infer<typeof userSchema.resendForgotPasswordToken>

export type ResendVerifyEmailToken = z.infer<typeof userSchema.resendVerifyEmailToken>
