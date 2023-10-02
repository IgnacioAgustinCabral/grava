'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

function getUsers(req, res) {
    const { enabled, sortBy } = req.query;

    const filter = {};

    if (enabled === 'true' || enabled === 'false') {
        filter.enabled = enabled === 'true';
    }

    const sortOption = {};

    //ordena por dni de forma ascendente
    if (sortBy === 'dni') {
        sortOption['userInformationData.dniInt'] = 1;
    } else {
        sortOption.createdAt = 1;
    }

    User.aggregate([
        {
            $match: filter,
        },
        {
            $lookup: {
                from: 'userinformations',
                localField: 'userInformation',
                foreignField: '_id',
                as: 'userInformationData',
            },
        },
        {
            $unwind: '$userInformationData',
        },
        {
            $addFields: {
                'userInformationData.dniInt': { $toInt: '$userInformationData.dni' },
            },
        },
        {
            $sort: sortOption,
        },
    ])
        .exec()
        .then((users) => {
            return res.status(200).json(users);
        })
        .catch((error) => {
            logger.error(`GET /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });
}

router.get('/users', getUsers);

module.exports = router;
