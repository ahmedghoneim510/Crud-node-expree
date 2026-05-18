const Joi = require('joi');

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

module.exports = { createCategorySchema, updateCategorySchema };
