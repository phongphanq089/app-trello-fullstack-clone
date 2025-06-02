export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10mb
export const ALLOW_COMMOM_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

export const ALLOW_COMMOM_FILE_TYPES_GALLERY = [
  // Image
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'image/gif',

  // Audio
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'audio/ogg', // .ogg

  // Video
  'video/mp4', // .mp4
  'video/quicktime', // .mov
  'video/x-msvideo' // .avi
]
