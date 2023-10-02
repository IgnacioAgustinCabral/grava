'use strict';
const router = require('express').Router();
const { default: mongoose } = require('mongoose');
const logger = require('../logger');
const { User } = require('../models');

function disableUser(req, res) {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    User.findById(userId)
        .populate('userInformation')
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "usuario no encontrado" });
            }
            if (!user.enabled) {
                return res.status(400).json({ message: "usuario ya deshabilitado" });
            }

            user.enabled = false;
            return user.save();
        })
        .then(updatedUser => {
            return res.status(200).json({ message: "usuario deshabilitado correctamente", user: updatedUser })
        })
        .catch((error) => {
            logger.error(`POST /users/:id/disable - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });;

}

router.post('/users/:id/disable', disableUser);

module.exports = router;