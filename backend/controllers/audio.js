const Audio = require('../models/audio');
const fs = require("fs");


exports.renameFile = (req, res, next) => {
    fs.rename(req.file.path, "./CNN/dataStemoscope/Test/" + req.body.label + "/" + req.body.label + "_" + req.file.filename, (err) => {
        if (err) throw err;
        console.log("File renamed and moved!");
    });
    req.file.path = req.body.label + "/" + req.body.label + "_" + req.file.filename;
    next();
}

exports.saveAudio = (req, res) => {
    console.log("req.file:", req.file);
    const audioFile = new Audio({
        audioName: req.file.filename,
        path : req.file.path,
        date: new Date().toDateString(),
        label: req.body.label,
    });
    audioFile.save()
        .then(() => res.status(201).json({message: 'Audio saved !'}))
        .catch(error => res.status(400).json({error}));
};


exports.getAllAudio = (req, res) => {
    Audio.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({error}));
};

exports.streamAudio = async (req, res) => {
    console.log("streamAudio")
    const audioData = await Audio.findOne({_id: req.params.id})
        .catch(error => res.status(404).json({error}));

    console.log("Find audio !:", audioData)

    const filePath = "./CNN/dataStemoscope/Test/" + audioData.path;

    console.log('File path: ', filePath)

    // Vérifiez si le fichier audio existe
    if (!fs.existsSync(filePath)) {
        res.status(404).send('Fichier audio non trouvé');
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
            res.status(416).send('Plage de lecture invalide');
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
