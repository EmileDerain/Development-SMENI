const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/', userCtrl.getAllUser);
router.get('/labels', userCtrl.getAllUserLabels);


module.exports = router;
