import express from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { validateRequest, wrapRequestHandler } from '~/middlewares/wrapRequestHandler'
import { createBoardController } from '~/controllers/board.controller'
import { BoardSchema } from '~/model/board.schema'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(HttpStatusCodes.SUCCESS.OK).json({ message: 'API v1 are ready to be used' })
})

Router.post('/board', validateRequest(BoardSchema.createBoardSchema), wrapRequestHandler(createBoardController))

export const API_V1 = Router
