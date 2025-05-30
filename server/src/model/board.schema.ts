import z from 'zod'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/constants/setting'

export class BoardSchema {
  public static createBoardSchema = z.object({
    title: z.string().min(1, { message: 'Title is requied' }).max(100, { message: 'Title too long' }),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
      .optional(),
    type: z.enum(['public', 'private']).default('public'),
    description: z.string().optional(),
    columnOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([]),
    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().nullable().default(null),
    ownerIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([]),
    memberIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([]),
    _destroy: z.boolean().default(false)
  })

  public static createColumnSchema = z.object({
    title: z.string().min(1, { message: 'Title is requied' }).max(100, { message: 'Title too long' }),
    boardId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' }),
    cardOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([])
  })

  public static createCardSchema = z.object({
    title: z.string().min(1, { message: 'Title is requied' }).max(100, { message: 'Title too long' }),
    boardId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' }),
    columnId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid columnIdformat (must be a valid ObjectId)' })
  })

  public static updateBoard = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.enum(['public', 'private']).default('public'),
    columnOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([])
  })

  public static updateColumn = z.object({
    cardOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([])
  })
  public static moveCardDifferentColumn = z.object({
    currentCardId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' }),
    nextCardOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([]),
    nextColumnId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' }),
    prevCardOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, { message: OBJECT_ID_RULE_MESSAGE })).default([]),
    prevColumnId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid boardId format (must be a valid ObjectId)' })
  })

  public static removeColumnSchema = z.object({
    columnId: z.string().regex(OBJECT_ID_RULE, { message: 'Invalid columnIdformat (must be a valid ObjectId)' })
  })
}

export type CreateBoardDto = z.infer<typeof BoardSchema.createBoardSchema>

export type CreateColumnDto = z.infer<typeof BoardSchema.createColumnSchema>

export type CreateCardDto = z.infer<typeof BoardSchema.createCardSchema>

export type UpdateBoard = z.infer<typeof BoardSchema.updateBoard>

export type UpdateColumn = z.infer<typeof BoardSchema.updateColumn>

export type MoveCardDifferentColumn = z.infer<typeof BoardSchema.moveCardDifferentColumn>

export type RemoveColumnSchema = z.infer<typeof BoardSchema.removeColumnSchema>
