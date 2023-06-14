const express = require('express');
const router = express.Router();

const audioCtrl = require('../controllers/audio');
const multer = require('../middleware/multer-config')

// TODO : rajouter les middlewares d'authentification quand le front sera prêt
router.post('/', multer, audioCtrl.renameFile, audioCtrl.saveAudio);
router.get('/', audioCtrl.getAllAudio);

router.get('/stream/:id', audioCtrl.streamAudio);


module.exports = router;
