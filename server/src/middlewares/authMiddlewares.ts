import { Request, Response, NextFunction } from 'express'

// Extend the Request interface to include jwtDecoded

import { AppError } from './errorHandler'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { jwtProvider } from '~/provider/jwtProvider'
import ENV_SETTING from '~/config/envSetting'

// middleware này sẽ đảm nhận việc quan trọng : xác thực cái jwt access nhận được từ FE có hợp lệ hay ko
export const authMiddlewares = async (req: Request, res: Response, next: any) => {
  // lấy access nằm trong res cookies  phía client - withCredentials trong file authorizeAxios
  // const clientAccesstoken = req.cookies?.accessToken

  // if (!clientAccesstoken) {
  //   next(new AppError('Unauthorized (token not found)', HTTTP_STATUS_CODE.CLIENT_ERROR.UNAUTHORIZED))
  //   return
  // }

  try {
    // const accessTokenDecode = await jwtProvider.verifyToken(
    //   clientAccesstoken,
    //   ENV_SETTING.ACCESS_TOKEN_SECRET_SIGNATURE
    // )

    // req.jwtDecoded = accessTokenDecode
    next()
  } catch (error) {
    // nếu cái accesstoken nó bị hết hạn thì mình cần trả về lỗi 410 cho phía FE biết để gọi api refeshToken
    if ((error as Error)?.message?.includes('jwt expired')) {
      next(new AppError('Need to refresh token', HTTTP_STATUS_CODE.CLIENT_ERROR.GONE))
      return
    }
    // nếu như accessToken nó ko hợp lệ do bất kỳ điều gì khác vụ hết hạn thì trả về 401 để FE logout
    next(new AppError('Unauthorized', HTTTP_STATUS_CODE.CLIENT_ERROR.UNAUTHORIZED))
  }
}
