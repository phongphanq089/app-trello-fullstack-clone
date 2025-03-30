export interface Cards {
  _id: string
  boardId: string
  columnId: string
  title: string
  description: string | null
  cover: string | null
  memberIds: string[]
  comments: string[]
  attachments: string[] | never[]
}

export interface Columns {
  _id: string
  boardId: string
  title: string
  cardOrderIds: string[]
  cards: Cards[]
}
