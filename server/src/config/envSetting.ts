import { config } from 'dotenv'
import path from 'path'
import fs from 'fs'

// get const NODE_ENV
const envConfig = process.env.NODE_ENV

// Create a path to the corresponding .env file
const envFilename = `.env.${envConfig}`

// Check if NODE_ENV is not present
if (!envConfig) {
  console.error(`Lỗi: Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${envConfig}, file môi trường sẽ là ${envFilename}`)

// Kiểm tra sự tồn tại của file .env.<environment>

if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
  console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
  process.exit(1)
}

// Load các biến môi trường từ file .env.<environment>
config({ path: envFilename })

// Kiểm tra các biến môi trường quan trọng

if (!process.env.DB_NAME || !process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
  console.error('Lỗi: Thiếu một hoặc nhiều biến môi trường quan trọng như DB_NAME, DB_USERNAME, DB_PASSWORD')
  process.exit(1)
}

// Xác định ứng dụng có đang chạy ở môi trường production không
export const isProduction = envConfig === 'production'

// Sử dụng fallback cho PORT với giá trị mặc định là 8017 nếu không có giá trị nào khác
const PORT = process.env.PORT || 8017

export const ENV_SETTING = {
  PORT: PORT,
  DB_NAME: process.env.DB_NAME || '',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_USENAME: process.env.DB_USERNAME || '',
  DB_USER_COLLECTION: process.env.DB_USER_COLLECTION || '',
  CLIENT_URL: process.env.CLIENT_URL || '',
  BOARD_COLLECTION_NAME: process.env.BOARD_COLLECTION_NAME || '',
  CARD_COLLECTION_NAME: process.env.CARD_COLLECTION_NAME || '',
  COLUMN_COLLECTION_NAME: process.env.COLUMN_COLLECTION_NAME || '',
  USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS || '',
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME || '',
  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE || '',
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || '',
  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE || '',
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || '',
  WEBSITE_DOMAIN_DEVELOPER: process.env.WEBSITE_DOMAIN_DEVELOPER || '',
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION || '',
  IMAGE_KIT_PUBLIC_KEY: process.env.IMAGE_KIT_PUBLIC_KEY || '',
  IMAGE_KIT_PRIVATE_KEY: process.env.IMAGE_KIT_PRIVATE_KEY || '',
  IMAGE_KIT_URLENDOINT: process.env.IMAGE_KIT_URLENDOINT || ''
}
export default ENV_SETTING
