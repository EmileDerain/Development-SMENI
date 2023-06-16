const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    mail: {type: String, unique: true, required: true},
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);