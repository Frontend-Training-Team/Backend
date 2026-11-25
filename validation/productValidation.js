import Joi from 'joi';

const productValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().max(500),
  category: Joi.string().required()
});

export { productValidationSchema };