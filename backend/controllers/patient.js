const Patient = require('../models/patient');

exports.createPatient = (req, res) => {
    const patient = new Patient({
        firstName: req.body.firstName, lastName: req.body.lastName, height: req.body.height, weight: req.body.weight, birthDate: req.body.birthDate
    });
    patient.save()
        .then(() => res.status(201).json({message: 'Patient created !'}))
        .catch(error => res.status(400).json({error, message: 'Error while creating patient !'}));
};

exports.getAllPatient = (req, res) => {
    Patient.find()
        .then(patients => res.status(200).json({"patients": patients, message: 'All the patients have been retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the patients'}));
}

exports.getPatientByName = (req, res) => {
    Patient.find({ $or: [{ firstName: req.body.name }, { lastName: req.body.name }] })
        .then(patient => res.status(200).json({patient, message: 'Patient retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving patient'}));
}