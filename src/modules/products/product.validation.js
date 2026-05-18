const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().min(10).max(2000).required(),
  price: Joi.number().min(0).required(),
  categoryId: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().min(10).max(2000),
  price: Joi.number().min(0),
  categoryId: Joi.string(),
}).min(1);

const queryProductSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string(),
  search: Joi.string().trim().max(100),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  sort: Joi.string().valid('price', '-price', 'createdAt', '-createdAt', 'title', '-title'),
});

module.exports = { createProductSchema, updateProductSchema, queryProductSchema };
