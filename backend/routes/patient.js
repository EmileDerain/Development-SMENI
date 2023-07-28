const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/patient');


router.get('/', userCtrl.getPatient);


router.post('/init', userCtrl.init100Patient);

router.post('/labels', userCtrl.getAllPatientLabelsFilter);
router.post('/', userCtrl.getAllPatientFilter);


router.post('/createPatient', userCtrl.createPatient);
router.post('/getAllPatients', userCtrl.getAllPatients);

router.post('/getPatientsByMedicalID', userCtrl.getPatientsByMedicalID);

module.exports = router;
