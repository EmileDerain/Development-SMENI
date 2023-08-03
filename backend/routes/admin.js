const express = require('express');
const router = express.Router();

const adminCtrl = require('../controllers/admin');
const adminMid = require('../middleware/authAdmin');

router.post('/signup', adminCtrl.signup);
router.post('/login', adminCtrl.login);

router.patch('/mail', adminMid, adminCtrl.patchMail)
router.patch('/password', adminMid, adminCtrl.patchPassword)

module.exports = router;
