const Joi = require ('joi');

const createUserValidator = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneno: Joi.string().length(11).regex(/^\d+$/).required(),
  email: Joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .required()
  .messages({
    'string.pattern.base': 'Email is not a valid email address'
  }),
  password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain one uppercase letter, at least one number and at least 6 characters long',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required()
}).strict()


const loginUserValidator = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/).required()
}).strict()

const resetPasswordValidator = Joi.object({
  password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain one uppercase letter, at least one number and at least 6 characters long'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ "any.only": "Passwords have to match" }),
  resetPasswordToken: Joi.string().optional
}).strict()

const updatePasswordValidator = Joi.object({
  password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()~¥=_+}{":;'?/>.<,`\-\|\[\]]{6,50}$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain one uppercase letter, at least one number and at least 6 characters long'
  }),
    
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords have to match" }),
});

module.exports = {createUserValidator, loginUserValidator, resetPasswordValidator, updatePasswordValidator};
