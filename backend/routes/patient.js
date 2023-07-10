const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/patient');

/*router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/', userCtrl.getAllUser);*/

router.post('/init', userCtrl.init100Patient);

router.post('/labels', userCtrl.getAllPatientLabelsFilter);

module.exports = router;
