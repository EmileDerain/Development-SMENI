const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/patient');

/*router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/', userCtrl.getAllUser);*/

router.get('/', userCtrl.getPatient);


router.post('/init', userCtrl.init100Patient);

router.post('/labels', userCtrl.getAllPatientLabelsFilter);
router.post('/', userCtrl.getAllPatientFilter);


module.exports = router;
