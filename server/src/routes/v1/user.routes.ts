import express from 'express'
import {
  forgotPaswordController,
  logoutController,
  refreshTokenController,
  registerUserController,
  resendEmailnController,
  resendForgotPasswordTokenController,
  updateAccountProfileController,
  updateChangePasswordController,
  userLoginController,
  userVerifyAccountController,
  verifyForgotPasswordController
} from '~/controllers/user.controller'
import { authMiddlewares } from '~/middlewares/authMiddlewares'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

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

Router.post(
  '/resend-email',
  validateRequest(userSchema.resendVerifyEmailToken),
  wrapRequestHandler(resendEmailnController)
)

Router.delete('/logout', wrapRequestHandler(logoutController))

Router.get('/refeshToken', wrapRequestHandler(refreshTokenController))

Router.put(
  '/updateAccount',
  authMiddlewares,
  multerUploadMiddleware.upload.single('profileImage'),
  validateRequest(userSchema.updateUserAccount),
  wrapRequestHandler(updateAccountProfileController)
)

Router.put(
  '/update-password',
  authMiddlewares,
  validateRequest(userSchema.updateChangePassword),
  wrapRequestHandler(updateChangePasswordController)
)

export const boardUser = Router
