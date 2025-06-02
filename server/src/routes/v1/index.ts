import express from 'express'
import { boardRoute } from './board.routes'

import { boardUser } from './user.routes'
import HTTTP_STATUS_CODE from '~/constants/HttpStatusCodes'
import { gallery } from './gallery.route'
const Router = express.Router()

Router.get('/status', (req, res) =>
  res.status(HTTTP_STATUS_CODE.SUCCESS.OK).json({ message: 'API v1 are ready to be used' })
)

/**
 * todo BOARDS ROUTE API
 */
Router.use('/boards', boardRoute)

/**
 * todo USERS ROUTE API
 */
Router.use('/users', boardUser)

/**
 *@GALLERY_IMAGE
 */
Router.use('/media', gallery)

export const API_V1 = Router
