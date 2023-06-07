const mongoose = require('mongoose');

const audioSchema = mongoose.Schema({
    audioUrl: {type: String, required: true},
    date : {type: String, required: false},
});

module.exports = mongoose.model('Audio', audioSchema);
