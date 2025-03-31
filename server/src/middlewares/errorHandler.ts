import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { isProduction } from '~/config/envSetting'

export class AppError extends Error {
  public statusCode: number
  public errors?: { path: string; message: string }[]

  constructor(message: string | any, statusCode: number, errors?: { path: string; message: string }[]) {
    super(typeof message === 'string' ? message : 'An error occurred') // Xử lý message không phải string
    this.statusCode = statusCode
    this.errors = errors // Lưu danh sách lỗi nếu có
    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || StatusCodes[statusCode]

  const responseError: any = {
    statusCode,
    message
  }
  // if list error (to Zod or custom), add to response
  if (err.errors && Array.isArray(err.errors)) {
    responseError.errors = err.errors
  } else if (!isProduction) {
    // Only add stack trace in dev mode if there are no errors
    responseError.stack = err.stack
  }
  res.status(statusCode).json(responseError)
}
