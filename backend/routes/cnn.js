const express = require('express');
const router = express.Router();

const cnnCtrl = require('../controllers/cnn');
const multer = require("../middleware/multer-config");

const adminMid = require('../middleware/authAdmin');
const authAdminDoctor = require('../middleware/authAdminDoctor');


router.post('/train', adminMid, cnnCtrl.train); //use
router.get('/', cnnCtrl.getAllModel); //TODO : use ??
router.get('/model', adminMid, cnnCtrl.getModelBySection); //use
router.post('/select', adminMid, cnnCtrl.selectModel); //use


router.get('/labels', cnnCtrl.getAllLabels); //TODO : use ??
router.post('/labels', authAdminDoctor, cnnCtrl.getAllLabelsFilter); //use

router.post('/predict', multer, cnnCtrl.renameFile, cnnCtrl.predict); //use mobile

router.delete('/', authAdminDoctor, cnnCtrl.deleteModel); //use


//TODO : delete
router.post('/initLabels', cnnCtrl.initLabels);
router.post('/init', cnnCtrl.init100Models);


module.exports = router;
