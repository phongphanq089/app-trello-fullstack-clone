import { AsyncLocalStorage } from 'async_hooks'
import { Collection, ObjectId } from 'mongodb'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { AppError } from '~/middlewares/errorHandler'
import { CreateBoardDto, CreateCardDto, CreateColumnDto, UpdateBoard } from '~/model/board.schema'
import { generateSlug } from '~/utils/lib'

class BoardService {
  private getColection(name: string): Collection {
    return databaseService.getDb().collection(name)
  }

  private async findOneById(collectionName: string, id: string) {
    try {
      const colection = this.getColection(collectionName)
      const result = await colection.findOne({ _id: new ObjectId(id) })

      return result
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private async pushColumnOrderIds(column: any) {
    try {
      const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)
      const result = await colection.findOneAndUpdate(
        {
          _id: column.boardId
        },
        {
          $push: { columnOrderIds: column._id }
        },
        { returnDocument: 'after' }
      )

      return result
    } catch (error: any) {
      throw new Error(error)
    }
  }

  private async pushCardOrderIds(card: any) {
    try {
      const colection = this.getColection(ENV_SETTING.COLUMN_COLLECTION_NAME)

      const result = await colection.findOneAndUpdate(
        {
          _id: card.columnId
        },
        {
          $push: { cardOrderIds: card._id }
        },
        { returnDocument: 'after' }
      )

      return result
    } catch (error: any) {
      throw new Error(error)
    }
  }

  public async createBoard(data: CreateBoardDto): Promise<any> {
    try {
      const newBoard = { slug: generateSlug(data.title), ...data }

      const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)

      const result = await colection.insertOne(newBoard)

      const resultNewBoard = await this.findOneById(ENV_SETTING.BOARD_COLLECTION_NAME, result.insertedId.toString())

      return resultNewBoard
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }

  public async updateBoard(id: string, data: UpdateBoard): Promise<any> {
    const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

    const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)
    try {
      const updateData = {
        ...data,
        updatedAt: Date.now()
      }

      Object.keys(updateData).forEach((fieldName) => {
        if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
          delete (updateData as Record<string, any>)[fieldName]
        }
      })

      const result = await colection.findOneAndUpdate(
        {
          _id: new ObjectId(id)
        },
        {
          $set: updateData
        },
        { returnDocument: 'after' }
      )
      return result
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }

  public async createColumn(data: CreateColumnDto): Promise<any> {
    try {
      const newColumn = { ...data, boardId: new ObjectId(data.boardId) }

      const colection = this.getColection(ENV_SETTING.COLUMN_COLLECTION_NAME)

      const result = await colection.insertOne(newColumn)

      const resultNewColumn = await this.findOneById(ENV_SETTING.COLUMN_COLLECTION_NAME, result.insertedId.toString())

      if (resultNewColumn) {
        resultNewColumn.cards = []

        await this.pushColumnOrderIds(resultNewColumn)
      }

      return resultNewColumn
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }

  public async createCard(data: CreateCardDto): Promise<any> {
    try {
      const newCard = { ...data, boardId: new ObjectId(data.boardId), columnId: new ObjectId(data.columnId) }

      const colection = this.getColection(ENV_SETTING.CARD_COLLECTION_NAME)

      const result = await colection.insertOne(newCard)

      const resultNewCard = await this.findOneById(ENV_SETTING.CARD_COLLECTION_NAME, result.insertedId.toString())

      if (resultNewCard) {
        await this.pushCardOrderIds(resultNewCard)
      }

      return resultNewCard
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  public async getDetailBoard(id: string): Promise<any> {
    const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)
    try {
      const resultBoard = await colection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
              _destroy: true
            }
          },
          {
            $lookup: {
              from: ENV_SETTING.COLUMN_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'boardId',
              as: 'columns'
            }
          },
          {
            $lookup: {
              from: ENV_SETTING.CARD_COLLECTION_NAME,
              localField: '_id',
              foreignField: 'boardId',
              as: 'cards'
            }
          }
        ])
        .toArray()
      return resultBoard[0] || null
    } catch (error) {
      throw new AppError(error, 500)
    }
  }
}

export const boardService = new BoardService()
