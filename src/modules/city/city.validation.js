const Joi = require('joi');

const createCitySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.min': 'City name must be between 2 and 100 characters',
      'string.max': 'City name must be between 2 and 100 characters',
      'any.required': 'City name is required',
    }),
});

const updateCitySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100)
    .messages({
      'string.min': 'City name must be between 2 and 100 characters',
      'string.max': 'City name must be between 2 and 100 characters',
    }),
});

module.exports = { createCitySchema, updateCitySchema };
