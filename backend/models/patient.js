const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const patientSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    height: {type: String},
    weight: {type: String},
    birthDate: {type: Date},
    medicalID: {type: Number, unique: true},
    gender: {type: Number},
    //comorbidities, gender
});

patientSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Patient', patientSchema);
