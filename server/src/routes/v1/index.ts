import express from 'express'
import HttpStatusCodes from '~/constants/HttpStatusCodes'
import { boardRouter } from './boardRouter'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(HttpStatusCodes.SUCCESS.OK).json({ message: 'API v1 are ready to be used' })
})

Router.use('/board', boardRouter)

export const API_V1 = Router
