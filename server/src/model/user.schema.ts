import z from 'zod'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/constants/setting'

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
}

export type UserRegistrationSchema = z.infer<typeof userSchema.userRegistrationSchema>

export type UserVerifyAccountSchema = z.infer<typeof userSchema.userVerifyAccountSchema>

export type UserLoginSchema = z.infer<typeof userSchema.userLoginSchema>
