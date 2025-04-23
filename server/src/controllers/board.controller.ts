import { Request, Response } from 'express'
import { cloneDeep, result } from 'lodash'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { BOARD_MESSAGES } from '~/constants/messages'
import { CreateBoardDto, CreateCardDto, CreateColumnDto, UpdateBoard } from '~/model/board.schema'
import { boardService } from '~/services/board.service'

export const createBoardController = async (req: Request<any, any, CreateBoardDto>, res: Response) => {
  const board = await boardService.createBoard(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: BOARD_MESSAGES.CREATE_BOARD_SUCCESS,
    result: board
  })
}

export const updateBoardController = async (req: Request<any, any, UpdateBoard>, res: Response) => {
  const BoardId = req.params.id as string
  const result = await boardService.updateBoard(BoardId, req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: BOARD_MESSAGES.UPDATE_BOARD_SUCCESS,
    result: result
  })
}

export const createColumnController = async (req: Request<any, any, CreateColumnDto>, res: Response) => {
  const result = await boardService.createColumn(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: BOARD_MESSAGES.CREATE_COLUMN_SUCCESS,
    result: result
  })
}

export const createCardController = async (req: Request<any, any, CreateCardDto>, res: Response) => {
  const result = await boardService.createCard(req.body)
  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: BOARD_MESSAGES.CREATE_CARD_SUCCESS,
    result: result
  })
}

export const getBoardDetailController = async (req: Request, res: Response) => {
  const id = req.params.id

  const board = await boardService.getDetailBoard(id)

  const resBoard = cloneDeep(board)

  resBoard.columns.forEach((column: any) => {
    column.cards = resBoard.cards.filter((card: any) => card.columnId.toString() === column._id.toString())
  })

  delete resBoard.cards

  return res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({
    message: BOARD_MESSAGES.GET_BOARD_DETAIL_SUCCESS,
    result: resBoard
  })
}
