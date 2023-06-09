const express = require('express');
const router = express.Router();

const audioCtrl = require('../controllers/audio');
const multer = require('../middleware/multer-config')


router.post('/', multer, audioCtrl.saveAudio);

module.exports = router;
