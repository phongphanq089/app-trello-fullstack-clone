export type BoardType = {
  title: string
  slug: string
  description: string | null
  columnOrderIds: string[]
  createdAt: Date
  updatedAt: Date
  _destroy: boolean
}
