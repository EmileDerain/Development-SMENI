const mongoose = require('mongoose');

const audioSchema = mongoose.Schema({
    audioUrl: {type: String, required: true},
});

module.exports = mongoose.model('Audio', audioSchema);
