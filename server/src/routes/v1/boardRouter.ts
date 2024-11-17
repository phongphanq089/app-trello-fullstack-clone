import express from 'express'
import boardValidation from '~/validations/board.validations'

const Router = express.Router()
Router.route('/')
  .get((req, res) => {
    res.status(200).json({ message: 'Boards API' })
  })
  .post(boardValidation.createApiDemo)

export const boardRouter = Router
