const express = require('express');
const router = express.Router();

const audioCtrl = require('../controllers/audio');
const multer = require('../middleware/multer-config')

// TODO : rajouter les middlewares d'authentification quand le front sera prêt
router.post('/', multer, audioCtrl.renameFile, audioCtrl.saveAudio);
router.get('/', audioCtrl.getAllAudio);

router.get('/Label/:label', audioCtrl.getAllAudioOfALabel);
router.get('/Doctor/:doctor', audioCtrl.getAllAudioOfADoctor);

router.get('/:pageNumber', audioCtrl.get10Audio);

router.post('/filter/:pageNumber', audioCtrl.getFilted10Audio);

router.get('/stream/:id', audioCtrl.streamAudio);


module.exports = router;
