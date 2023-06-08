const Audio = require('../models/audio');

exports.saveAudio = (req, res) => {
    console.log("req.file: ", req.body);
    const audioFile = new Audio({
        audioUrl: `${req.protocol}://${req.get('host')}/audioFiles/${req.file.originalname}`,
        date : new Date().toDateString(),
        label : req.body.label,
    });
    audioFile.save()
        .then(() => res.status(201).json({message: 'Audio enregistré !'}))
        .catch(error => res.status(400).json({error}));
};
