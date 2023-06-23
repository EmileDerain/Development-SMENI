const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const audioSchema = mongoose.Schema({
    audioName: {type: String, required: true, unique: true},
    path: {type: String, required: true},
    date: {type: String, required: true},
    label: {type: String, required: true},
    doctor: {type: String, required: true},
    patient: {type: String, required: true},
    time: {type: String, required: true},
});

audioSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Audio', audioSchema);
