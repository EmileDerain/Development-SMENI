const express = require('express');
const router = express.Router();

const cnnCtrl = require('../controllers/cnn');


router.get('/model', cnnCtrl.getModel);
router.post('/train', cnnCtrl.train);


module.exports = router;
