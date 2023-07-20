const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
    mail: {type: String, unique: true, required: true},
    password: {type: String, required: true},
});

adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Admin', adminSchema);
