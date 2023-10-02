'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        lowercase: true
    },
    city: {
        type: String,
        required: true,
        lowercase: true
    },
    province: {
        type: String,
        required: true,
        lowercase: true
    },
    postalCode: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Address', addressSchema)