'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User, UserInformation } = require('../models');
const Joi = require('joi');

const userSchema = Joi.object({
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
});

function validateFields(req, res, next) {
    const { error } = userSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    return next();
}

function createUserInformation(req, res, next) {
    const userInformationData = req.body.userInformation;

    return UserInformation.create(userInformationData)
        .then((userInformation) => {
            req.userInformation = userInformation;
            return next();
        })
        .catch((error) => {
            logger.error(`POST /users - createUserInformation error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });
}

function saveUser(req, res) {
    const userData = req.body.user;

    userData.userInformation = req.userInformation._id;

    return User.create(userData)
        .then((user) => {
            return res.status(201).json(user.toJSON());
        })
        .catch((error) => {
            logger.error(`POST /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });
}


router.post(
    '/users',
    validateFields,
    createUserInformation,
    saveUser
);

module.exports = router;
