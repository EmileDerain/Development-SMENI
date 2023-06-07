const Audio = require('../models/audio');

exports.saveAudio = (req, res) => {
    console.log('testestsetes')
    console.log("req.file: ", req.file);
    const bp = new Audio({
        audioUrl: `${req.protocol}://${req.get('host')}/audioFiles/${req.file.originalname}`  //UTILITER ??
    });
    bp.save()
        .then(() => res.status(201).json({message: 'Audio enregistré !'}))
        .catch(error => res.status(400).json({error, test:"rte"}));
};
