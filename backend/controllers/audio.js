const Audio = require('../models/audio');
const fs = require("fs");
const Model = require("../models/model");
const wav = require('node-wav');

const {getAudioDurationInSeconds} = require('get-audio-duration')

exports.renameFile = (req, res, next) => {
    fs.rename(req.file.path, "./CNN/dataStemoscope/Test/" + req.body.label + "/" + req.body.label + "_" + req.file.filename, (err) => {
        if (err) {
            console.log("Error : file renamed and moved!");
            res.status(500).json({"status": 500, "reason": "Can't rename file"})
            throw err;
        } else {
            console.log("File renamed and moved!");
            req.file.path = req.body.label + "/" + req.body.label + "_" + req.file.filename;
            next();
        }
    });
}

exports.saveAudio = async (req, res) => {
    console.log("req.file:", req.file);

    const duration = await getAudioDurationInSeconds("./CNN/dataStemoscope/Test/" + req.file.path).then((duration) => {
        return duration;
    })

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const audioFile = new Audio({
        audioName: req.file.filename,
        path: req.file.path,
        date: formattedDate,
        label: req.body.label,
        doctor: "Tom Jedusor",
        patient: "undefine",
        time : Math.ceil(duration),
    });
    audioFile.save()
        .then(() => res.status(201).json({"status": 201, message: 'Audio saved'}))
        .catch(error => res.status(400).json({"status": 201, reason: error}));
};

function getWavDuration(filePath) {
    const buffer = fs.readFileSync(filePath);
    console.log("buffer:", buffer)
    const result = wav.decode(buffer);
    console.log("result:", result)
    const duration = result.duration;
    console.log("duration:", duration)
    return duration;
}

exports.getAllAudio = (req, res) => {
    Audio.find()
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.streamAudio = async (req, res) => {
    console.log("streamAudio")
    const audioData = await Audio.findOne({_id: req.params.id})
        .catch(error => res.status(404).json({"status": 404, "reason": "Not found"}));

    console.log("Find audio !:", audioData)

    const filePath = "./CNN/dataStemoscope/Test/" + audioData.path;

    console.log('File path: ', filePath)

    // Vérifiez si le fichier audio existe
    if (!fs.existsSync(filePath)) {
        res.status(404).send({"status": 404, "reason": "Not found"});
        return;
    }

    // Récupérer les informations sur le fichier audio
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        // Extraire les valeurs de "start" et "end" et vérifier si elles sont des entiers valides
        const positions = range.replace(/bytes=/, '').split('-');
        const start = parseInt(positions[0], 10);
        const end = positions[1] ? parseInt(positions[1], 10) : fileSize - 1;

        if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize || start < 0 || end < 0 || start > end) {
            res.status(416).send({"status": 416, "reason": "Invalid range request"});
            return;
        }

        const chunkSize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, {start, end});

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg'
        });

        fileStream.pipe(res);
    } else {
        // Si aucune plage n'est spécifiée, diffusez l'intégralité du fichier
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg'
        });
        fs.createReadStream(filePath).pipe(res);
    }
};

exports.deleteAudio = (req, res) => {
    Audio.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({message: 'Audio delete !'}))
        .catch(error => res.status(400).json({error}));
};
