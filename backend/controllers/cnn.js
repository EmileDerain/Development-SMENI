const Audio = require('../models/audio');
const express = require('express');
const {exec} = require('child_process');
const {spawn} = require('child_process');
const serverConf = require("../global/server");

const path = require("path");
const fs = require("fs");

exports.renameFile = (req, res, next) => {
    const sourcePath = "./" + req.file.path;
    const destinationPath = "./CNN/temp/" + req.file.filename;

    fs.copyFile(sourcePath, destinationPath, (err) => {
        if (err) throw err;
        console.log("File copied to the new location!");

        fs.unlink(sourcePath, (err) => {
            if (err) throw err;
            console.log("Old file removed!");
        });

        req.file.path = destinationPath;
        next();
    });
};


exports.getModel = () => {
    express.static(path.join(__dirname, './CNN/models/my_model_save.h5'))
};

exports.train = (req, res) => {
    console.log('RUN train');
    serverConf.IO.emit("receive_cnn_logs", "Start building a new model");
    console.log('IO.emit');

    var dataToSend;

    res.send({message: "Start building a new model"})

    const python = spawn('python', ['CNN/LSTM_Classification.py']);

    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        serverConf.IO.emit("receive_cnn_logs", dataToSend);
        console.log(dataToSend);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
    });
};


exports.predict = async (req, res) => {
    console.log("req.file.path: ", req.file.path);
    const python = spawn('python', ['./CNN/LSTM_Classification_model.py', req.file.path, './CNN/models/my_model_save.h5']);

    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Le fichier a été supprimé avec succès: ', req.file.path);
            });
        }
        // send data to browser
        res.send(JSON.parse(dataToSend));
    });
};
