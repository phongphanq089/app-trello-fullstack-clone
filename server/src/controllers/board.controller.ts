import { NextFunction, Request, Response } from 'express'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { CreateBoardDto } from '~/model/board.schema'
import { boardService } from '~/services/board.service'

export const createBoardController = async (req: Request<any, any, CreateBoardDto>, res: Response) => {
  const board = await boardService.createBoard(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json(board)
}
