import { Request, Response } from 'express'
import Joi from 'joi'
import HttpStatusCodes from '~/constants/HttpStatusCodes'

class BoardValidation {
  async createApiDemo(req: Request, res: Response) {
    const schema = Joi.object({
      title: Joi.string().required().min(3).max(50).trim().strict()
    })
    try {
      console.log(req.body, 'req body')
      await schema.validateAsync(req.body, { abortEarly: false })
      res.status(200).json({ message: 'create  Boards API successfully' })
    } catch (err) {
      console.log(err)

      res.status(HttpStatusCodes.CLIENT_ERROR.UNPROCESSABLE_ENTITY).json({ error: err })
    }
  }
}

const boardValidation = new BoardValidation()

export default boardValidation
