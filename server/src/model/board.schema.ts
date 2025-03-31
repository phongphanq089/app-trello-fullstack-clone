import z from 'zod'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/constants/setting'

export class BoardSchema {
  public static createBoardSchema = z.object({
    title: z.string().min(1, 'Title is requied errr').max(100, 'Title too long'),
    description: z.string().optional(),
    columnOrderIds: z.array(z.string().regex(OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE)).default([]),
    createdAt: z.number().default(() => Date.now()),
    updatedAt: z.number().nullable().default(null),
    _destroy: z.boolean().default(false)
  })
}

export type CreateBoardDto = z.infer<typeof BoardSchema.createBoardSchema>
