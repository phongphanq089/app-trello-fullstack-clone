import express from 'express'
import { registerUserController, userLoginController, userVerifyAccountController } from '~/controllers/user.controller'
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

export const boardUser = Router
