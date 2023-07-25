const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const audioSchema = new Schema({
    audioName: {type: String, required: true},
    path: {type: String, required: true, unique: true},
    date: {type: String, required: true},
    duration: {type: Number, required: true},
    label: {type: String, required: true},


    labelId: {type: ObjectId, required: true},
    doctorId: {type: ObjectId, required: true},

    //patient
    patientId: {type: ObjectId, required: true}, //patient

    height: {type: Number, required: true},
    weight: {type: Number, required: true},
    age: {type: Number, required: true},  //Mois ou ans
    gender: {type: Number, required: true},  //1: women, 2: male


    comorbidities: {type: String, required: false}, //A demander
});

audioSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Audio', audioSchema);
