const Joi = require('joi');

const userValidation = Joi.object({
    user: Joi.object({
        email: Joi.string().email().required(),
        color: Joi.string().valid('red', 'green', 'blue'),
    }),
    userInformation: Joi.object({
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        dni: Joi.string().required(),
        age: Joi.number().integer().min(0).max(200),
    }).required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        postalCode: Joi.string()
    }).required()
});

module.exports = { userValidation }