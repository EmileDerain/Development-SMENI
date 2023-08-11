const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/patient');

const adminMid = require('../middleware/authAdmin');
const doctorMid = require('../middleware/authDoctor');
const authAdminDoctor = require('../middleware/authAdminDoctor');

//TODO : create patient folder
/*router.post('/signup', userCtrl.signup);

router.post('/login', userCtrl.login);

router.get('/', userCtrl.getAllUser);*/

router.get('/', authAdminDoctor, userCtrl.getPatient); //use

router.post('/labels', authAdminDoctor, userCtrl.getAllPatientLabelsFilter); //use
router.post('/', authAdminDoctor, userCtrl.getAllPatientFilter); //use

router.patch('/', authAdminDoctor, userCtrl.patchPatient)

router.delete('/', authAdminDoctor, userCtrl.deletePatient); //use

//TODO : delete
router.post('/init', userCtrl.init100Patient);

router.post('/createPatient', userCtrl.createPatient);
router.post('/getAllPatients', userCtrl.getAllPatients);

router.post('/getPatientsByMedicalID', userCtrl.getPatientsByMedicalID);

module.exports = router;
