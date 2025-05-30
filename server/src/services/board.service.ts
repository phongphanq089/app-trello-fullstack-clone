import { Collection, ObjectId } from 'mongodb'
import { title } from 'process'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { AppError } from '~/middlewares/errorHandler'
import {
  CreateBoardDto,
  CreateCardDto,
  CreateColumnDto,
  MoveCardDifferentColumn,
  UpdateBoard,
  UpdateColumn
} from '~/model/board.schema'
import { generateSlug, pagingSkipValue } from '~/utils/lib'

class BoardService {
  getColection(name: string): Collection {
    return databaseService.getDb().collection(name)
  }
  /**
   *@FIND_ONE_BUY_ID
   */
  private async findOneById(collectionName: string, id: string) {
    try {
      const colection = this.getColection(collectionName)
      const result = await colection.findOne({ _id: new ObjectId(id) })

      return result
    } catch (error: any) {
      throw new Error(error)
    }
  }

  /**
   *@PUSH_COLUMN_ORDERIDS
   */
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
  /**
   *@PUSH_CARD_ORDERIDS
   */
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
  /**
   *@CREATE_BOARD
   */
  async createBoard(userId: string, data: CreateBoardDto) {
    try {
      const newBoard = { slug: generateSlug(data.title), ...data, ownerIds: [new ObjectId(userId)] }

      const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)

      const result = await colection.insertOne(newBoard)

      const resultNewBoard = await this.findOneById(ENV_SETTING.BOARD_COLLECTION_NAME, result.insertedId.toString())

      return resultNewBoard
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   *@GET_BOARD
   */
  async getBoard(userId: string, page: string, itemsPerpage: string) {
    const DEFAULT_PAGE = '1'
    const DEFAULT_ITEM_PER_PAGE = '12'

    const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)

    try {
      if (!page) page = DEFAULT_PAGE

      if (!itemsPerpage) itemsPerpage = DEFAULT_ITEM_PER_PAGE

      const queryConditions = [
        // điều kiện 1 :board chưa bị xoá
        { _destroy: false },
        // điều kiện 2 : userId đang thực hiện request này nó phải thuộc vào 1 trong 2 cái mảng ownerIds hoặc memberId , sử dụng toán tử $all của mongoDB
        {
          $or: [{ ownerIds: { $all: [new ObjectId(userId)] } }, { memberIds: { $all: [new ObjectId(userId)] } }]
        }
      ]

      const query = colection.aggregate(
        [
          { $match: { $and: queryConditions } },
          // sort mặt định của board theo A-Z ( mặt định sẽ bị chữ B hoa đứng trước chữ a thường (theo chuẩn mã ASCII ))

          { $sort: { title: 1 } },
          //sử lý nhiều luồng trong 1 query
          {
            $facet: {
              // luồng 01  : query boards
              queryBoards: [
                { $skip: pagingSkipValue(parseInt(page, 10), parseInt(itemsPerpage, 10)) }, // bỏ qua số lượng bản ghi của những trang trước đó
                { $limit: parseInt(itemsPerpage, 10) } // giới hạn tối đa số lượng bản ghi trả về trong 1 page
              ],
              // luồng 02 : query đếm tổng tất cả số lượng  bản ghi trong db và trả về
              queryTotalBoards: [{ $count: 'countedAllBoards' }]
            }
          }
        ],
        { collation: { locale: 'en' } }
      )

      console.log(query.toArray(), '44444')

      const results = await query.toArray()

      const res = results[0]

      return {
        boards: res.queryBoards || [],
        totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
      }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.CLIENT_ERROR.BAD_REQUEST)
    }
  }

  /**
   *@UPDATE_BOARD
   */
  async updateBoard(id: string, data: UpdateBoard) {
    const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

    const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)
    try {
      const updateData = {
        ...data,
        updatedAt: Date.now()
      }

      if (updateData.columnOrderIds) {
        updateData.columnOrderIds = updateData.columnOrderIds.map((id: any) => new ObjectId(id)) as any
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
  /**
   *@CREATE_COLUMN
   */
  async createColumn(data: CreateColumnDto): Promise<any> {
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
  /**
   * @UPDATE_COLUMN
   */
  async updateColumn(id: string, data: UpdateColumn) {
    const INVALID_UPDATE_FIELDS = ['_id', 'boardId']

    const colection = this.getColection(ENV_SETTING.COLUMN_COLLECTION_NAME)

    const updateData = {
      ...data
    }

    try {
      Object.keys(updateData).forEach((fieldName) => {
        if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
          delete (updateData as Record<string, any>)[fieldName]
        }
      })

      if (updateData.cardOrderIds) {
        updateData.cardOrderIds = updateData.cardOrderIds.map((id) => new ObjectId(id)) as any
      }

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
  /**
   * @MOVE_CARD_DIFFERENT_COLUMN
   */
  async moveCardDifferentColumn(res: MoveCardDifferentColumn) {
    const { prevColumnId, nextColumnId, prevCardOrderIds, nextCardOrderIds, currentCardId } = res

    const prevColumnObjectId = new ObjectId(prevColumnId)
    const nextColumnObjectId = new ObjectId(nextColumnId)
    const currentCardObjectId = new ObjectId(currentCardId)

    const INVALID_UPDATE_FIELDS = ['_id', 'boardId']
    const colectionColumn = this.getColection(ENV_SETTING.COLUMN_COLLECTION_NAME)

    const colectionCard = this.getColection(ENV_SETTING.CARD_COLLECTION_NAME)

    try {
      const cleanRes = { ...res }
      Object.keys(cleanRes).forEach((fieldName) => {
        if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
          delete (cleanRes as Record<string, any>)[fieldName]
        }
      })

      await Promise.all([
        colectionColumn.findOneAndUpdate(
          {
            _id: prevColumnObjectId
          },
          {
            $set: {
              cardOrderIds: prevCardOrderIds
            }
          },
          { returnDocument: 'after' }
        ),
        colectionColumn.findOneAndUpdate(
          {
            _id: nextColumnObjectId
          },
          {
            $set: {
              cardOrderIds: nextCardOrderIds
            }
          },
          { returnDocument: 'after' }
        )
      ])

      await colectionCard.findOneAndUpdate(
        {
          _id: currentCardObjectId
        },
        {
          $set: {
            columnId: nextColumnObjectId
          }
        },
        { returnDocument: 'after' }
      )
      return { status: 'success', updatedCardId: currentCardId }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * @REMOVE_COLUMN
   */
  async removeColumn(id: string) {
    const colectionColumn = this.getColection(ENV_SETTING.COLUMN_COLLECTION_NAME)
    const colectionCard = this.getColection(ENV_SETTING.CARD_COLLECTION_NAME)
    const colectionBoard = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)

    try {
      const targetColumn = await this.findOneById(ENV_SETTING.COLUMN_COLLECTION_NAME, id)

      if (!targetColumn) {
        throw new AppError('Column not fount', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
      }

      await colectionColumn.deleteOne({
        _id: new ObjectId(id)
      })
      await colectionCard.deleteMany({
        columnId: new ObjectId(id)
      })

      await colectionBoard.findOneAndUpdate(
        {
          _id: new ObjectId(targetColumn.boardId)
        },
        { $pull: { columnOrderIds: new ObjectId(targetColumn._id) } } as any,
        { returnDocument: 'after' }
      )

      return { removeColumn: 'Column removed successfulled' }
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * @CREATE_CARD
   */
  async createCard(data: CreateCardDto): Promise<any> {
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
  /**
   *@GET_DETAIL_BOARD
   */
  async getDetailBoard(id: string): Promise<any> {
    const colection = this.getColection(ENV_SETTING.BOARD_COLLECTION_NAME)
    try {
      const resultBoard = await colection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
              _destroy: false
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
