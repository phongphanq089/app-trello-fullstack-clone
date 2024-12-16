import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TRELLO_MESSAGE } from '~/constants/messages'
import boardService from '~/services/board.service'
import { BoardType } from '~/types/Boards'

export const createBoardController = async (req: Request<ParamsDictionary, any, BoardType>, res: Response) => {
  const result = await boardService.createNewboard(req.body)
  return res.status(200).json({ message: TRELLO_MESSAGE.BOARDS_SUCESSFULLY, result: result })
}

export const getDetailBoardController = async (req: Request<ParamsDictionary, any, BoardType>, res: Response) => {
  const paramId = req.params.id
  const result = await boardService.getBoardDetail(paramId)
  return res.status(200).json({ message: TRELLO_MESSAGE.BOARDS_SUCESSFULLY, result: result })
}
