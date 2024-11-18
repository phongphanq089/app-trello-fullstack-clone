import { NextFunction, Request, Response } from 'express'
import { isProduction } from '~/config/envSetting'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { ValidationError } from 'joi'

export const defaultErrorHandle = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.statusCode) err.statusCode = HttpStatusCodes.SERVER_ERROR.INTERNAL_SERVER_ERROR

  if (err instanceof ValidationError) {
    const formattedError = err.details.map((detail) => ({
      path: detail.path.join('.'),
      message: detail.message,
      type: detail.type
    }))

    return res.status(HttpStatusCodes.CLIENT_ERROR.BAD_REQUEST).json({
      statusCode: HttpStatusCodes.CLIENT_ERROR.BAD_REQUEST,
      message: 'Validation Error',
      errors: formattedError
    })
  }

  const message =
    HttpStatusCodes.SERVER_ERROR[err.statusCode as keyof typeof HttpStatusCodes.SERVER_ERROR] || 'Unexpected Error'

  const responseError = {
    statusCode: err.statusCode,
    message: err.message || message,
    ...(isProduction ? {} : { stack: err.stack })
  }

  res.status(responseError.statusCode).json(responseError)
}
