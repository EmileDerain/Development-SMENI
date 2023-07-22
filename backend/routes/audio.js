const express = require('express');
const router = express.Router();

const audioCtrl = require('../controllers/audio');
const multer = require('../middleware/multer-config')

const doctorMid = require('../middleware/authDoctor');
const authAdminDoctor = require('../middleware/authAdminDoctor');


router.post('/', doctorMid, multer, audioCtrl.renameFile, audioCtrl.saveAudio);
router.get('/', audioCtrl.getAllAudio); //TODO : use ??

router.get('/Label/:label', audioCtrl.getAllAudioOfALabel); //TODO : use ??
router.get('/Doctor/:doctor', audioCtrl.getAllAudioOfADoctor); //TODO : use ??
router.get('/patient', audioCtrl.getPatientAudio); //use

router.get('/:pageNumber', audioCtrl.get10Audio); //TODO : use ??

router.post('/filter/:pageNumber', authAdminDoctor, audioCtrl.getAudioFiltedBySection);  //use a refaire ()


router.delete('/', authAdminDoctor, audioCtrl.deleteAudio);  //use

router.post('/init', audioCtrl.init100Audio);

module.exports = router;
