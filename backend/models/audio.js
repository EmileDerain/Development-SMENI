const mongoose = require('mongoose');

const audioSchema = mongoose.Schema({
    audioName: {type: String, required: true},
    path: {type: String, required: true},
    date : {type: String, required: true},
    label :  {type: String, required: true},
});

module.exports = mongoose.model('Audio', audioSchema);
