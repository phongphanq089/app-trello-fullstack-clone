import { NextFunction, Request, Response } from 'express'
import Joi, { ObjectSchema } from 'joi'

const validateRequest =
  <T>(schema: ObjectSchema<T>) =>
  (req: Request<any, any, T>, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      return next(error)
    }
    next()
  }

export default validateRequest
