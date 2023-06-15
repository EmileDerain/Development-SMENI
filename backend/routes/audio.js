const express = require('express');
const router = express.Router();

const audioCtrl = require('../controllers/audio');
const multer = require('../middleware/multer-config')


router.post('/', multer, audioCtrl.renameFile, audioCtrl.saveAudio);
router.get('/', audioCtrl.getAllAudio);

router.get('/stream/:id', audioCtrl.streamAudio);


module.exports = router;
