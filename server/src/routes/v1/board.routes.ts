import express from 'express'

import { validateRequest, wrapRequestHandler } from '~/middlewares/wrapRequestHandler'
import {
  createBoardController,
  createCardController,
  createColumnController,
  getBoardDetailController,
  updateBoardController
} from '~/controllers/board.controller'
import { BoardSchema } from '~/model/board.schema'

const Router = express.Router()

Router.post('/createBoard', validateRequest(BoardSchema.createBoardSchema), wrapRequestHandler(createBoardController))

Router.put('/updateBoard/:id', validateRequest(BoardSchema.updateBoard), wrapRequestHandler(updateBoardController))

Router.get('/getBoard/:id', wrapRequestHandler(getBoardDetailController))

Router.post(
  '/createColumn',
  validateRequest(BoardSchema.createColumnSchema),
  wrapRequestHandler(createColumnController)
)

Router.post('/createCard', validateRequest(BoardSchema.createCardSchema), wrapRequestHandler(createCardController))

export const boardRoute = Router
