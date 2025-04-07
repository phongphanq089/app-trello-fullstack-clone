import express from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
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

Router.get('/status', (req, res) =>
  res.status(HttpStatusCodes.SUCCESS.OK).json({ message: 'API v1 are ready to be used' })
)

Router.post('/board', validateRequest(BoardSchema.createBoardSchema), wrapRequestHandler(createBoardController))

Router.put('/board/:id', validateRequest(BoardSchema.updateBoard), wrapRequestHandler(updateBoardController))

Router.get('/board/:id', wrapRequestHandler(getBoardDetailController))

Router.post('/column', validateRequest(BoardSchema.createColumnSchema), wrapRequestHandler(createColumnController))

Router.post('/card', validateRequest(BoardSchema.createCardSchema), wrapRequestHandler(createCardController))

export const API_V1 = Router
