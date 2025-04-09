import { pick } from 'lodash'
import { UserRegistrationSchema } from '~/model/user.schema'

export const generateSlug = (title: string): string => {
  return title
    .normalize('NFD') // Chuyển đổi sang dạng có dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu tiếng Việt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ lại chữ cái, số, khoảng trắng và dấu '-'
    .trim()
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng '-'
    .replace(/-+/g, '-') // Loại bỏ các dấu '-' liên tiếp
}

export const pickUser = (user: any) => {
  if (!user) return {}
  return pick(user, [
    '_id',
    'username',
    'email',
    'displayName',
    'avatar',
    'role',
    'isActive',
    'verifyToken',
    'createdAt',
    'updatedAt'
  ])
}
