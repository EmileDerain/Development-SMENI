const express = require('express');
const router = express.Router();

const cnnCtrl = require('../controllers/cnn');
const multer = require("../middleware/multer-config");


router.post('/train', cnnCtrl.train);
router.get('/', cnnCtrl.getAllModel);
router.post('/select', cnnCtrl.selectModel);


router.post('/initLabels', cnnCtrl.initLabels);
router.get('/labels', cnnCtrl.getAllLabels);

router.post('/predict', multer, cnnCtrl.renameFile, cnnCtrl.predict);

router.delete('/:id', cnnCtrl.deleteModel);


module.exports = router;
