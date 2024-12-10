import { ObjectId } from 'mongodb'
import databaseService from '~/config/mongoDb'
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
}

const boardService = new BoardService()

export default boardService
