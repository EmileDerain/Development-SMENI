const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const labelSchema = mongoose.Schema({
    labelName: {type: String, required: true, unique: true},
});

labelSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Label', labelSchema);
