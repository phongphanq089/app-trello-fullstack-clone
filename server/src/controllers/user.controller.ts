import { Request, Response } from 'express'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { UserLoginSchema, UserRegistrationSchema, UserVerifyAccountSchema } from '~/model/user.schema'
import { userService } from '~/services/user.service'

export const registerUserController = async (req: Request<any, any, UserRegistrationSchema>, res: Response) => {
  const result = await userService.registerUser(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json(result)
}

export const userVerifyAccountController = async (req: Request<any, any, UserVerifyAccountSchema>, res: Response) => {
  const result = await userService.verifyAccount(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json(result)
}

export const userLoginController = async (req: Request<any, any, UserLoginSchema>, res: Response) => {
  const result = await userService.Login(req.body)

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json(result)
}
