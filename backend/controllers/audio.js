const Audio = require('../models/audio');
const fs = require("fs");
const Model = require("../models/model");
const wav = require('node-wav');

const {getAudioDurationInSeconds} = require('get-audio-duration')

exports.renameFile = (req, res, next) => {
    const date = Date.now();
    const path = req.body.label + "/" + req.body.filename.replace(" ", "_") + "_" + req.body.label + "_" + date + ".wav";

    fs.rename(req.file.path, "./CNN/dataStemoscope/Test/" + path, (err) => {
        if (err) {
            console.log("Error : file renamed and moved!");
            res.status(500).json({"status": 500, "reason": "Can't rename file"})
            throw err;
        } else {
            console.log("File renamed and moved!");
            req.file.path = path;
            req.file.filename = req.body.filename;
            next();
        }
    });
}

exports.saveAudio = async (req, res) => {
    console.log("req.file:", req.file);

    const duration = await getAudioDurationInSeconds("./CNN/dataStemoscope/Test/" + req.file.path).then((duration) => {
        return duration - 1;  //Difference of lib in the front and the back to calculate duration of a audio file
    })

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const audioFile = new Audio({
        audioName: req.file.filename,
        path: req.file.path,
        date: formattedDate,
        label: req.body.label,
        doctor: req.body.doctor,
        patient: req.body.patient,
        duration: Math.ceil(duration),
    });

    audioFile.save()
        .then(() => {
            console.log('Audio saved');
            res.status(201).json({"status": 201, message: 'Audio saved'})
        })
        .catch(error => {
            console.log('Audio error: ', error);
            res.status(400).json({"status": 201, reason: error})
        });
};

exports.getAllAudio = (req, res) => {
    Audio.find()
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.get10Audio = async (req, res) => {
    const nbAudio = 11;
    const audioCount = await Audio.countDocuments();
    console.log("min", (parseInt(req.params.pageNumber) - 1) * nbAudio);
    console.log("max", parseInt(req.params.pageNumber) * nbAudio);

    Audio.find().skip((req.params.pageNumber - 1) * nbAudio).limit(nbAudio)
        .then(audios => res.status(200).json({
            "status": 200,
            "audioCount": Math.ceil(audioCount / nbAudio),
            "audios": audios
        }))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.getFilted10Audio = async (req, res) => {
    console.log("req.body2:", req.body);

    const nbAudio = 11;

    const orConditionsLabels = [];
    const orConditionsDoctor = [];
    const orConditionsPatient = [];

    const pageNumber = req.body.pageNumber;


    for (let i = 0; i < req.body.filter.label.length; i++) {
        const regex = new RegExp(`\\b${req.body.filter.label[i]}`, "i");
        orConditionsLabels.push({label: {$regex: regex}})
    }

    for (let i = 0; i < req.body.filter.doctor.length; i++) {
        const regex = new RegExp(`\\b${req.body.filter.doctor[i]}`, "i");
        orConditionsDoctor.push({doctor: {$regex: regex}})
    }
    for (let i = 0; i < req.body.filter.patient.length; i++) {
        const regex = new RegExp(`\\b${req.body.filter.patient[i]}`, "i");
        orConditionsPatient.push({patient: {$regex: regex}})
    }

    if (orConditionsLabels.length === 0)
        orConditionsLabels.push({})

    if (orConditionsDoctor.length === 0)
        orConditionsDoctor.push({})

    if (orConditionsPatient.length === 0)
        orConditionsPatient.push({})

    console.log(orConditionsLabels);
    console.log(orConditionsDoctor);
    console.log(orConditionsPatient);

    const audioCount = await Audio.find({
        $and: [
            {$or: orConditionsLabels},
            {$or: orConditionsDoctor},
            {$or: orConditionsPatient},
        ]
    }).countDocuments();

    console.log('Nb audioCount: ', audioCount)

    Audio.find({
        $and: [
            {$or: orConditionsLabels},
            {$or: orConditionsDoctor},
            {$or: orConditionsPatient},
        ]
    }).skip((pageNumber - 1) * nbAudio).limit(nbAudio)
        .then(audios => res.status(200).json({
            "status": 200,
            "audioCount": Math.ceil(audioCount / nbAudio),
            "audios": audios
        }))
        .catch(error => {
            console.log(error);
            res.status(400).json({"status": 400, reason: error})
        });
};

exports.getAllAudioOfALabel = (req, res) => {
    Audio.find({label: req.params.label.toLowerCase()})
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.getAllAudioOfADoctor = (req, res) => {
    Audio.find({doctor: req.params.doctor})
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.deleteAudio = (req, res) => {
    const {id} = req.query;

    Audio.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: 'Audio delete !'}))
        .catch(error => res.status(400).json({error}));
};
