import Joi from 'joi'

export const boardValidation = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': '"title" is required and cannot be empty'
  }),
  slug: Joi.string()
    .optional()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .messages({
      'string.empty': '"slug" is required and cannot be empty',
      'string.pattern.base': '"slug" must be a valid slug (lowercase, alphanumeric, hyphens allowed)'
    }),
  description: Joi.string().allow(null, '').messages({
    'string.empty': '"description" can be empty but must be a string'
  }),
  columnOrderIds: Joi.array().items(Joi.string().required()).required().messages({
    'array.base': '"columnOrderIds" must be an array of strings',
    'array.includesRequiredUnknowns': '"columnOrderIds" must include valid string IDs'
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').allow(null, Date.now),
  _destroy: Joi.boolean().default(false).messages({
    'boolean.base': '"_destroy" must be a boolean value'
  }),
  type: Joi.string().valid('public', 'private').required()
})
