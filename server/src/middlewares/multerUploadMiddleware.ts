import multer from 'multer'
import { ALLOW_COMMOM_FILE_TYPES_GALLERY, LIMIT_COMMON_FILE_SIZE } from '~/constants/setting'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

import { Request } from 'express'
import { FileFilterCallback } from 'multer'

const customFileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (!ALLOW_COMMOM_FILE_TYPES_GALLERY.includes(file.mimetype)) {
    const err = new Error('file type is invalid. Only accept jpg, jpeg ,png')
    return callback(err as any, false)
  }

  return callback(null, true)
}

const tmpFolder = path.join(__dirname, '../../tmp')
if (!fs.existsSync(tmpFolder)) {
  fs.mkdirSync(tmpFolder, { recursive: true })
}

// Tạo tên file random an toàn
const generateFilename = (originalname: string) => {
  const ext = path.extname(originalname)
  const name = crypto.randomBytes(16).toString('hex')
  return `${Date.now()}-${name}${ext}`
}

// Thiết lập storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpFolder)
  },
  filename: function (req, file, cb) {
    const filename = generateFilename(file.originalname)
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  limits: { fieldSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = { upload }
