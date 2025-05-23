export interface CardType {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string | null
  cover: string | null
  memberIds: string[]
  comments: string[]
  attachments: string[]
}

export interface ColumnType {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: CardType[]
}

export interface Board {
  _id: string
  title: string
  description: string
  type: 'public' | 'private'
  ownerIds: string[]
  memberIds: string[]
  columnOrderIds: string[]
  columns: ColumnType[]
}
