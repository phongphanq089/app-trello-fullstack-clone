import { Request, Response } from 'express'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { USER_MESSAGES } from '~/constants/messages'
import {
  ForgotPasswordSchema,
  ResendForgotPasswordToken,
  ResendVerifyEmailToken,
  UserLoginSchema,
  UserRegistrationSchema,
  UserVerifyAccountSchema,
  VerifyForgotPassword
} from '~/model/user.schema'
import { userService } from '~/services/user.service'
import ms from 'ms'

export const registerUserController = async (req: Request<any, any, UserRegistrationSchema>, res: Response) => {
  const result = await userService.registerUser(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: USER_MESSAGES.REGISTER_SUCCESS,
    result: result
  })
}

export const userVerifyAccountController = async (req: Request<any, any, UserVerifyAccountSchema>, res: Response) => {
  const result = await userService.verifyAccount(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: USER_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result: result
  })
}

export const userLoginController = async (req: Request<any, any, UserLoginSchema>, res: Response) => {
  const result = await userService.Login(req.body)

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: USER_MESSAGES.LOGIN_SUCCESS,
    result: result
  })
}

export const forgotPaswordController = async (req: Request<any, any, ForgotPasswordSchema>, res: Response) => {
  const result = await userService.forgotPassWord(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    forgot_password_token: result.forgot_password_token
  })
}

export const verifyForgotPasswordController = async (req: Request<any, any, VerifyForgotPassword>, res: Response) => {
  const result = await userService.verifyForgotPassword(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    messsage: result.message
  })
}

export const resendForgotPasswordTokenController = async (
  req: Request<any, any, ResendForgotPasswordToken>,
  res: Response
) => {
  const result = await userService.resendForgotPasswordToken(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    messsage: result.message
  })
}

export const resendEmailnController = async (req: Request<any, any, ResendVerifyEmailToken>, res: Response) => {
  const result = await userService.resendEmail(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    messsage: result.message
  })
}

export const logoutController = async (req: Request<any, any, any>, res: Response) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    messsage: { LogOut: true }
  })
}

export const refreshTokenController = async (req: Request<any, any, any>, res: Response) => {
  const result = await userService.refreshToken(req.cookies?.refreshToken as string)

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: ms('14 days')
  })
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: result
  })
}

export const updateAccountProfileController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id

  const fileBuffer = req?.file?.buffer || null

  const result = await userService.updateUserAccount(userId, fileBuffer, req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Update Profile succeess !',
    result: result
  })
}

export const updateChangePasswordController = async (req: Request<any, any, any>, res: Response) => {
  const userId = req.jwtDecoded._id

  const result = await userService.updatePassword(userId, req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: 'Update password succeess !',
    result: result
  })
}
