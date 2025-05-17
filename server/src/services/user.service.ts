import { Collection, ObjectId } from 'mongodb'
import ENV_SETTING from '~/config/envSetting'
import databaseService from '~/config/mongoDb'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { AppError } from '~/middlewares/errorHandler'
import {
  ForgotPasswordSchema,
  ResendForgotPasswordToken,
  ResendVerifyEmailToken,
  UserLoginSchema,
  UserRegistrationSchema,
  UserVerifyAccountSchema,
  VerifyForgotPassword
} from '~/model/user.schema'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/lib'
import { BrevoProvider } from '~/provider/brevoProvider'
import { jwtProvider } from '~/provider/jwtProvider'
import { USER_MESSAGES } from '~/constants/messages'

class UserService {
  private getColection(name: string): Collection {
    return databaseService.getDb().collection(name)
  }
  /**
   *@CHECK_EMAIL_EXIT
   */
  private async checkExitEmail(email: string) {
    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)
    const isExitEmail = await colection.findOne({ email })
    return isExitEmail
  }
  /**
   *@FIND_ONE_BY_ID
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
   *@CREATE_USER
   */
  async createUser(data: UserRegistrationSchema): Promise<any> {
    try {
      const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)

      const result = await colection.insertOne({ ...data })

      const resultNewBoard = await this.findOneById(ENV_SETTING.USER_COLLECTION_NAME, result.insertedId.toString())

      return resultNewBoard
    } catch (error) {
      throw new AppError(error, HTTTP_STATUS_CODE.SERVER_ERROR.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   *@UPDATE_USER
   */
  async updateUser(
    id: string,
    data: {
      isActive?: boolean
      verifyToken?: null | string
      forgot_password_token?: null | string
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
   *@REGISTER_USER
   */
  async registerUser(resBody: UserRegistrationSchema) {
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
        verifyLink: `${ENV_SETTING.WEBSITE_DOMAIN_DEVELOPER}/auth/verify-email?email=${resBody.email}&token=${resultNewUser.verifyToken}`,
        logoUrl: 'https://trungquandev.com/wp-content/uploads/2020/08/logo-trungquandev-white-bg.jpg',
        year: `${new Date().getFullYear()}`
      },
      'src/templates/template-mail.html'
    )

    return pickUser(resultNewUser)
  }
  /**
   *@VERIFY_ACCOUNT
   */
  async verifyAccount(resBody: UserVerifyAccountSchema) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }

    if (existUser.isActive) {
      throw new AppError('Your account is already active!', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
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
   *@LOGIN_ACCOUNT
   */
  async Login(resBody: UserLoginSchema) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }
    if (!existUser.isActive) {
      throw new AppError(
        'Please check and verify your account before logging in!',
        HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE
      )
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
  /**
   *@FORGOT_PASSWORD
   */
  async forgotPassWord(resBody: ForgotPasswordSchema) {
    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }

    const ForgotPasswordToken = uuidv4()

    const expiresAt = Date.now() + 15 * 60 * 1000

    await colection.updateOne(
      { _id: new ObjectId(existUser._id) },
      {
        $set: {
          forgot_password_token: ForgotPasswordToken,
          forgot_password_token_expired_at: expiresAt
        },
        $currentDate: {
          updatedAt: true
        }
      }
    )

    await BrevoProvider.sendMail(
      resBody.email,
      'Reset your password',
      {
        name: 'Nguyễn Văn A',
        companyName: 'Trello Clone',
        verifyLink: `${resBody.urlRedirect}?email=${existUser.email}&token=${ForgotPasswordToken}`,
        logoUrl: 'https://trungquandev.com/wp-content/uploads/2020/08/logo-trungquandev-white-bg.jpg',
        year: `${new Date().getFullYear()}`
      },
      'src/templates/forgot-password.html'
    )

    return {
      forgot_password_token: ForgotPasswordToken
    }
  }
  /**
   *@VERIFY_FORGOT_PASSWORD
   */
  async verifyForgotPassword(resBody: VerifyForgotPassword) {
    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }

    if (resBody.token !== existUser.forgot_password_token) {
      throw new AppError('Token is invalid!', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }

    if (!existUser.forgot_password_token_expired_at || existUser.forgot_password_token_expired_at < Date.now()) {
      throw new AppError('Token has expired!', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }

    const hashedPassword = bcrypt.hashSync(resBody.password, 8)

    await colection.updateOne(
      { _id: new ObjectId(existUser._id) },
      {
        $set: {
          password: hashedPassword,
          forgot_password_token: null
        },
        $currentDate: {
          updatedAt: true
        }
      }
    )
    return {
      message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    }
  }
  /**
   *@RESEND_FORGOT_PASSWORD_TOKEN
   */
  async resendForgotPasswordToken(resBody: ResendForgotPasswordToken) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }

    const newToken = uuidv4()
    const expiresAt = Date.now() + 15 * 60 * 1000

    const colection = this.getColection(ENV_SETTING.USER_COLLECTION_NAME)

    await colection.updateOne(
      { _id: new ObjectId(existUser._id) },
      {
        $set: {
          forgot_password_token: newToken,
          forgot_password_token_expired_at: expiresAt
        },
        $currentDate: {
          updatedAt: true
        }
      }
    )

    await BrevoProvider.sendMail(
      resBody.email,
      'Reset your password (new link)',
      {
        name: existUser.displayName || 'User',
        companyName: 'Trello Clone',
        verifyLink: `${resBody.urlRedirect}?email=${resBody.email}&token=${newToken}`,
        logoUrl: 'https://trungquandev.com/wp-content/uploads/2020/08/logo-trungquandev-white-bg.jpg',
        year: `${new Date().getFullYear()}`
      },
      'src/templates/forgot-password.html'
    )

    return { message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS }
  }
  /**
   *@RESEND_EMAIL
   */
  async resendEmail(resBody: ResendVerifyEmailToken) {
    const existUser = await this.checkExitEmail(resBody.email)

    if (!existUser) {
      throw new AppError('Account not found', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_FOUND)
    }
    if (existUser.isActive) {
      throw new AppError('Your email has been verified', HTTTP_STATUS_CODE.CLIENT_ERROR.NOT_ACCEPTABLE)
    }

    await BrevoProvider.sendMail(
      resBody.email,
      'Trello MERN stack advanced : please your email before using our services',
      {
        name: 'Nguyễn Văn A',
        companyName: 'Trello Clone',
        verifyLink: `${ENV_SETTING.WEBSITE_DOMAIN_DEVELOPER}/auth/verify-email?email=${resBody.email}&token=${existUser.verifyToken}`,
        logoUrl: 'https://trungquandev.com/wp-content/uploads/2020/08/logo-trungquandev-white-bg.jpg',
        year: `${new Date().getFullYear()}`
      },
      'src/templates/template-mail.html'
    )

    return { message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS }
  }
}

export const userService = new UserService()
