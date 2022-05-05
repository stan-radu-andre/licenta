// validation
const Joi = require('@hapi/joi');

const registerSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const options = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: false, // remove unknown props
};

const validateRegister = (req, res, next) => {
  // validate request body against schema
  const { error, value } = registerSchema.validate(req.body, options);
  if (error) {
    // on fail return comma separated errors
    res.status(400).json({
      error: `Validation error: ${error.details
        .map((x) => x.message)
        .join(', ')}`,
    });
  } else {
    // on success replace req.body with validated value and trigger next middleware function
    req.body = value;
    next();
  }
};

const validateLogin = (req, res, next) => {
  // validate request body against schema
  const { error, value } = loginSchema.validate(req.body, options);
  if (error) {
    // on fail return comma separated errors
    res.status(400).json({
      error: `Validation error: ${error.details
        .map((x) => x.message)
        .join(', ')}`,
    });
  } else {
    // on success replace req.body with validated value and trigger next middleware function
    req.body = value;
    next();
  }
};

module.exports = { validateRegister, validateLogin };
