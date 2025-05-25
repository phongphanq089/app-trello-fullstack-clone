import express from 'express'

import { validateRequest, wrapRequestHandler } from '~/middlewares/wrapRequestHandler'
import {
  createBoardController,
  createCardController,
  createColumnController,
  getBoardController,
  getBoardDetailController,
  moveCardDifferentColumnController,
  removeColumnController,
  updateBoardController,
  updateColumnController
} from '~/controllers/board.controller'
import { BoardSchema } from '~/model/board.schema'
import { authMiddlewares } from '~/middlewares/authMiddlewares'

const Router = express.Router()

Router.post('/board-list', authMiddlewares, wrapRequestHandler(getBoardController))

Router.post(
  '/createBoard',
  authMiddlewares,
  validateRequest(BoardSchema.createBoardSchema),
  wrapRequestHandler(createBoardController)
)

Router.put(
  '/updateBoard/:id',
  authMiddlewares,
  validateRequest(BoardSchema.updateBoard),
  wrapRequestHandler(updateBoardController)
)

Router.post(
  '/createColumn',
  authMiddlewares,
  validateRequest(BoardSchema.createColumnSchema),
  wrapRequestHandler(createColumnController)
)

Router.put(
  '/updateColumn/:id',
  // authMiddlewares,
  validateRequest(BoardSchema.updateColumn),
  wrapRequestHandler(updateColumnController)
)

Router.put(
  '/moveCardDifferentColumn',
  // authMiddlewares,
  validateRequest(BoardSchema.moveCardDifferentColumn),
  wrapRequestHandler(moveCardDifferentColumnController)
)

Router.get('/getBoard/:id', authMiddlewares, wrapRequestHandler(getBoardDetailController))

Router.put(
  '/removeColumn/:id',
  validateRequest(BoardSchema.removeColumnSchema),
  wrapRequestHandler(removeColumnController)
)

Router.post(
  '/createCard',
  authMiddlewares,
  validateRequest(BoardSchema.createCardSchema),
  wrapRequestHandler(createCardController)
)

export const boardRoute = Router
