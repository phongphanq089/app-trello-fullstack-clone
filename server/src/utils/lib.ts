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

export const pagingSkipValue = (page: number, itemsPerpage: number) => {
  if (!page || !itemsPerpage) return 0
  if (page <= 0 || itemsPerpage <= 0) return 0

  return (page - 1) * itemsPerpage
}

export const getTypeFolder = (mimetype: string) => {
  if (mimetype.startsWith('image/')) return 'images'
  if (mimetype.startsWith('audio/')) return 'audios'
  if (mimetype.startsWith('video/')) return 'videos'
  return 'others'
}
