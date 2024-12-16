import Joi from 'joi'
import { ObjectId } from 'mongodb'
import envSetting from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import { boardValidation } from '~/models/schema/board.validations'
import { BoardType } from '~/types/Boards'
import { handleError } from '~/utils/utils'

class BoardModel {
  async createNewBoard(data: BoardType) {
    try {
      await boardValidation.validateAsync(data, { abortEarly: false })

      return await databaseService.board.insertOne(data)
    } catch (error) {
      throw handleError(error)
    }
  }
  async getDetailBoard(id: string) {
    try {
      const result = await databaseService.board
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
              _destroy: false
            }
          },
          {
            $lookup: {
              from: envSetting.DB_COLUMNS_COLLECTION,
              localField: '_id',
              foreignField: 'boardId',
              as: 'columns'
            }
          },
          {
            $lookup: {
              from: envSetting.DB_CARDS_COLLECTION,
              localField: '_id',
              foreignField: 'boardId',
              as: 'cards'
            }
          }
        ])
        .toArray()

      return result[0] || {}
    } catch (error) {
      throw handleError(error)
    }
  }
}

const boardModel = new BoardModel()

export default boardModel
