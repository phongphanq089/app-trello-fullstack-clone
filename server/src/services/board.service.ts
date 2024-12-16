import { cloneDeep } from 'lodash'
import { ObjectId } from 'mongodb'
import databaseService from '~/config/mongoDb'
import { TRELLO_MESSAGE } from '~/constants/messages'
import boardModel from '~/models/board.model'
import { BoardType } from '~/types/Boards'
import ApiError from '~/utils/ApiError'
import { stringToSlug } from '~/utils/utils'

class BoardService {
  private async getNewBoard(id: string) {
    return await databaseService.board.findOne({
      _id: new ObjectId(id)
    })
  }
  async createNewboard(data: BoardType) {
    const createBoard = await boardModel.createNewBoard({ ...data, slug: stringToSlug(data.title) })

    const getNewBoads = await this.getNewBoard(createBoard.insertedId.toString())

    return getNewBoads
  }
  async getBoardDetail(id: string) {
    const boardDetail = await boardModel.getDetailBoard(id)
    if (!boardDetail) {
      throw ApiError.notFound(TRELLO_MESSAGE.BOARD_NOT_FOUND)
    }
    const resBoard = cloneDeep(boardDetail)
    resBoard.columns.forEach((column: any) => {
      column.cards = resBoard.cards.filter((card: any) => card.columnId.equals(column._id))
    })

    delete resBoard.cards

    return resBoard
  }
}

const boardService = new BoardService()

export default boardService
