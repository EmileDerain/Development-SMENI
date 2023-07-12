const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const audioSchema = mongoose.Schema({
    audioName: {type: String, required: true},
    path: {type: String, required: true, unique: true},
    date: {type: String, required: true},
    label: {type: String, required: true},
    doctor: {type: String, required: true},
    patient: {type: String, required: true}, //patient

    //patient
    patientId: {type: String, required: false}, //patient

    height: {type: Number, required: false},
    weight: {type: Number, required: false},
    age: {type: Number, required: false},
    comorbidities: {type: String, required: false}, //A demander

    duration: {type: Number, required: true},
});

audioSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Audio', audioSchema);
