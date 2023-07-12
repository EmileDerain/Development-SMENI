const express = require('express');
const router = express.Router();

const cnnCtrl = require('../controllers/cnn');
const multer = require("../middleware/multer-config");


router.post('/train', cnnCtrl.train);
router.get('/', cnnCtrl.getAllModel);
router.get('/model', cnnCtrl.getAllModelBySection);
router.post('/select', cnnCtrl.selectModel);


router.get('/labels', cnnCtrl.getAllLabels);
router.post('/labels', cnnCtrl.getAllLabelsFilter);

router.post('/predict', multer, cnnCtrl.renameFile, cnnCtrl.predict);

router.delete('/', cnnCtrl.deleteModel);


router.post('/initLabels', cnnCtrl.initLabels);
router.post('/init', cnnCtrl.init100Models);


module.exports = router;
