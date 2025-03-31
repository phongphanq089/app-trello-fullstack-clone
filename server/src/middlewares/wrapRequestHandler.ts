import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AppError } from './errorHandler'
import { ZodError, ZodSchema } from 'zod'

export function wrapRequestHandler<P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  func: RequestHandler<P, ResBody, ReqBody, ReqQuery>
) {
  return async (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages = err.errors.map((error) => ({
          path: error.path.join('.'),
          message: error.message
        }))
        next(new AppError('Validation failed', 400, errorMessages))
      } else if (err instanceof AppError) {
        next(err)
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Internal server error'
        next(new AppError(errorMessage, 500))
      }
    }
  }
}

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message
      }))
      throw new AppError('Validation failed', 400, errors)
    }
    req.body = result.data
    next()
  }
}
