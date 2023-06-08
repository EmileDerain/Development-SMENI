const Audio = require('../models/audio');
const express = require('express');
const path = require("path");

exports.train = (req, res) => {

};


exports.getModel = () => {
    express.static(path.join(__dirname, 'CNN/my_model.h5'))
};
