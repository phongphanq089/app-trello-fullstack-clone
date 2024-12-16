import express from 'express'
import { createBoardController, getDetailBoardController } from '~/controllers/board.controller'
import validateRequest from '~/utils/validateRequest'
import { wrapRequesHandler } from '~/utils/wrapRequestHandler'
import { boardValidation } from '~/models/schema/board.validations'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'Boards API' })
  })
  .post(validateRequest(boardValidation), wrapRequesHandler(createBoardController))

Router.route('/:id').get(wrapRequesHandler(getDetailBoardController))
export const boardRouter = Router
