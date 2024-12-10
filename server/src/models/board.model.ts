import Joi from 'joi'
import databaseService from '~/config/mongoDb'
import { boardValidation } from '~/validations/board.validations'

class BoardModel {
  async createNewBoard(data: any) {
    try {
      await boardValidation.validateAsync(data, { abortEarly: false })

      return await databaseService.board.insertOne(data)
    } catch (error) {
      throw new Error(error as any)
    }
  }
}

const boardModel = new BoardModel()

export default boardModel
