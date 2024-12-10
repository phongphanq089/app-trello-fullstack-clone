import express from 'express'
import { boardController } from '~/controllers/board.controller'
import validateRequest from '~/utils/validateRequest'
import { wrapRequesHandler } from '~/utils/wrapRequestHandler'
import { boardValidation } from '~/validations/board.validations'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'Boards API' })
  })
  .post(validateRequest(boardValidation), wrapRequesHandler(boardController))

export const boardRouter = Router
