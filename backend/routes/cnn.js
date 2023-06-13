const express = require('express');
const router = express.Router();

const cnnCtrl = require('../controllers/cnn');
const multer = require("../middleware/multer-config");


router.get('/model', cnnCtrl.getModel);
router.post('/train', cnnCtrl.train);

router.post('/predict', multer, cnnCtrl.renameFile, cnnCtrl.predict);

module.exports = router;
