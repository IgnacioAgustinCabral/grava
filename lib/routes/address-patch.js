'use strict';
const router = require('express').Router();
const logger = require('../logger');
const { Address } = require('../models');
const { addressValidation } = require('../middleware/validation');

function validateAddress(req, res, next) {
    const { error } = addressValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
}


function updateAddress(req, res) {
    const addressId = req.params.id;
    const fieldsToUpdate = req.body;

    Address.findByIdAndUpdate(addressId, fieldsToUpdate, { new: true, runValidators: true })
        .exec()
        .then(updatedAddress => {
            if (!updatedAddress) {
                return res.status(404).json({ message: 'address id no encontrado' });
            }

            return res.status(200).json(updatedAddress);
        })
        .catch((error) => {
            logger.error(`PATCH /addresses/:id - Error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error',
            });
        });
}

router.patch('/address/:id', validateAddress, updateAddress)

module.exports = router;