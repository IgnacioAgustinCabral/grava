'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { User } = require('../models');

function getUserAddress(req, res) {
    const userId = req.params.id;

    // if (!mongoose.isValidObjectId(userId)) {
    //     return res.status(404).json({ message: "Usuario no encontrado" });
    // }

    User.findById(userId)
        .populate('address')
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "usuario no encontrado" });
            }
            return res.status(200).json(user);
        })
        .catch((error) => {
            logger.error(`POST /users/:id/address - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });

}

router.get('/users/:id/address', getUserAddress);

module.exports = router;