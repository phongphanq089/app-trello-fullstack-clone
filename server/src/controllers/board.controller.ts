import { Request, Response } from 'express'

export const boardController = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'create  Boards API successfully' })
}
