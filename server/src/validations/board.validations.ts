import Joi from 'joi'

export const boardValidation = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(50).trim().strict()
})
