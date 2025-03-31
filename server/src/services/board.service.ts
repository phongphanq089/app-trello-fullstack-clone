import { Collection } from 'mongodb'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import { AppError } from '~/middlewares/errorHandler'
import { CreateBoardDto } from '~/model/board.schema'

class BoardService {
  private collection: Collection

  constructor() {
    this.collection = databaseService.getDb().collection(ENV_SETTING.BOARD_NAME as string)
  }
  public async createBoard(data: CreateBoardDto): Promise<any> {
    try {
      const newBoard = { ...data }
      const result = await this.collection.insertOne(newBoard)
      return { _id: result.insertedId, ...newBoard }
    } catch (error) {
      throw new AppError('Failed to create board', 500)
    }
  }
}

export const boardService = new BoardService()
