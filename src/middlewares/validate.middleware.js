const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    throw new ApiError(400, message);
  }

  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    throw new ApiError(400, message);
  }

  next();
};

module.exports = { validate, validateQuery };
