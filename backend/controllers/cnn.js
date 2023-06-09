const Audio = require('../models/audio');
const express = require('express');
const { exec } = require('child_process');
const { spawn } = require('child_process');

const path = require("path");

exports.getModel = () => {
    express.static(path.join(__dirname, 'CNN/my_model.h5'))
};

exports.train = (req, res) => {
    console.log('RUN train')
    var dataToSend;

    const python = spawn('python', ['CNN/LSTM_Classification.py']);

    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
    });

    // exec('python CNN/LSTM_Classification.py', (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`Une erreur s'est produite : ${error}`);
    //         return;
    //     }
    //     console.log(`Sortie du script Python : ${stdout}`);
    // });
    //
    // res.status(201).json({message: 'Train en cours'})
};
