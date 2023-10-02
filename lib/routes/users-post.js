'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User, UserInformation, Address } = require('../models');
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
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required(),
        postalCode: Joi.string()
    }).required()
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

function createAddress(req, res, next) {
    const addressData = req.body.address;

    return Address.create(addressData)
        .then(address => {
            req.address = address;
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
    userData.address = req.address._id;


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
    createAddress,
    saveUser
);

module.exports = router;
