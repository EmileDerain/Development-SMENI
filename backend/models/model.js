const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const modelSchema = mongoose.Schema({
    modelName: {type: String, required: true, unique: true},
    accuracy: {type: Number},
    loss: {type: Number},
    date: {type: Date},
    path: {type: String},
});

modelSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Model', modelSchema);
