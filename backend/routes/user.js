const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const adminMid = require('../middleware/authAdmin');
const doctorMid = require('../middleware/authDoctor');


router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/', userCtrl.getAllUser); //TODO : use ??
router.get('/labels', adminMid, userCtrl.getAllUserLabels);

router.post('/labels', adminMid, userCtrl.getAllUserLabelsFilter); //use
router.post('/', adminMid, userCtrl.getUserFilterBySection); //use

router.patch('/mail', doctorMid, userCtrl.patchMail)
router.patch('/password', doctorMid, userCtrl.patchPassword)

router.patch('/administration/mail', adminMid, userCtrl.patchMailAdministration)
// router.patch('/administration/password', adminMid, userCtrl.patchPasswordAdministration)

module.exports = router;
