import { Collection, ObjectId } from 'mongodb'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { AppError } from '~/middlewares/errorHandler'
import { UserLoginSchema, UserRegistrationSchema, UserVerifyAccountSchema } from '~/model/user.schema'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/lib'
import { BrevoProvider } from '~/provider/brevoProvider'
import { jwtProvider } from '~/provider/jwtProvider'

class UserService {
  private getColection(name: string): Collection {
    return databaseService.getDb().collection(name)
  }
  /**
   * todo checkEmailExit
   * @param email
   * @returns
   */
  private async checkExitEmail(email: string) {
    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)
    const isExitEmail = await colection.findOne({ email })
    return isExitEmail
  }
  /**
   * ! PRIVATE
   * todo findOneById
   * @param CreateBoardDto
   * @returns
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
   * todo UPDATE BOARD
   * @param id
   * @param isActive: true | verifyToken: null
   * @returns
   */
  public async updateUser(
    id: string,
    data: {
      isActive: boolean
      verifyToken: null | string
    }
  ): Promise<any> {
    const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)
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
  /**
   * todo CREATE USER
   * @param UserRegistrationSchema
   * @returns
   */
  public async createUser(data: UserRegistrationSchema): Promise<any> {
    try {
      const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)

      const result = await colection.insertOne({ ...data })

      const resultNewBoard = await this.findOneById(ENV_SETTING.USER_COLLECTION_NAME, result.insertedId.toString())

      return resultNewBoard
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  public async registerUser(resBody: UserRegistrationSchema) {
    const exitUser = await this.checkExitEmail(resBody.email)

    if (exitUser) {
      throw new AppError('Email already exit!', HTTTP_STATUS_CODE.CLIENT_ERROR.CONFLICT)
    }

    const nameFromEmail = resBody.email.split('@')[0]

    const newUser = {
      ...resBody,
      password: bcrypt.hashSync(resBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    const resultNewUser = await this.createUser(newUser)

    await BrevoProvider.sendMail(
      resultNewUser.email,
      'Trello MERN stack advanced : please your email before using our services',
      {
        name: 'Nguyễn Văn A',
        companyName: 'Trello Clone',
        verifyLink: `https://example.com/confirm?token=${resultNewUser.verifyToken}`,
        logoUrl: 'https://trungquandev.com/wp-content/uploads/2020/08/logo-trungquandev-white-bg.jpg',
        year: `${new Date().getFullYear()}`
      }
    )

    return pickUser(resultNewUser)
  }
  /**
   * todo verifyAccount
   * @param UserVerifyAccountSchema
   * @returns
   */
  public async verifyAccount(resBody: UserVerifyAccountSchema) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }
    if (existUser.isActive) {
      throw new AppError('Your account is already active !', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }
    if (resBody.token !== existUser.verifyToken) {
      throw new AppError('Token is invalid!', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updateUser = await this.updateUser(existUser._id.toString(), updateData)

    return pickUser(updateUser)
  }
  /**
   * todo Login
   * @param UserVerifyAccountSchema
   * @returns
   */
  public async Login(resBody: UserLoginSchema) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }
    if (!existUser.isActive) {
      throw new AppError('Your account is already active !', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }
    if (!bcrypt.compareSync(resBody.password, existUser.password)) {
      throw new AppError('Your email or password is incorrect !', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }

    const userInfo = { _id: existUser._id.toString(), email: existUser.email }

    const accessToken = await jwtProvider.generateToken({
      payload: userInfo,
      options: {
        expiresIn: ENV_SETTING.ACCESS_TOKEN_LIFE
      },
      secretOrPrivateKey: ENV_SETTING.ACCESS_TOKEN_SECRET_SIGNATURE
    })

    const refreshToken = await jwtProvider.generateToken({
      payload: userInfo,
      options: {
        expiresIn: ENV_SETTING.REFRESH_TOKEN_LIFE
      },
      secretOrPrivateKey: ENV_SETTING.REFRESH_TOKEN_SECRET_SIGNATURE
    })

    return { accessToken, refreshToken, ...pickUser(existUser) }
  }
}

export const userService = new UserService()
