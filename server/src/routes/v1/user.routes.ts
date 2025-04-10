import express from 'express'
import {
  forgotPaswordController,
  registerUserController,
  resendForgotPasswordTokenController,
  userLoginController,
  userVerifyAccountController,
  verifyForgotPasswordController
} from '~/controllers/user.controller'
import { validateRequest, wrapRequestHandler } from '~/middlewares/wrapRequestHandler'
import { userSchema } from '~/model/user.schema'

const Router = express.Router()

Router.post('/register', validateRequest(userSchema.userRegistrationSchema), wrapRequestHandler(registerUserController))

Router.put(
  '/verify',
  validateRequest(userSchema.userVerifyAccountSchema),
  wrapRequestHandler(userVerifyAccountController)
)

Router.post('/login', validateRequest(userSchema.userLoginSchema), wrapRequestHandler(userLoginController))

Router.post('/forgot-pasword', validateRequest(userSchema.forgotPassword), wrapRequestHandler(forgotPaswordController))

Router.post(
  '/verify-forgot-password',
  validateRequest(userSchema.verifyForgotPassword),
  wrapRequestHandler(verifyForgotPasswordController)
)

Router.post(
  '/resend-forgot-password-token',
  validateRequest(userSchema.resendForgotPasswordToken),
  wrapRequestHandler(resendForgotPasswordTokenController)
)

export const boardUser = Router
