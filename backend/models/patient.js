const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const patientSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    height: {type: String},
    weight: {type: String},
    birthDate: {type: Date},
    medicalID: {type: Number},
    gender: {type: Number},
});

patientSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Patient', patientSchema);
