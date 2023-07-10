const Patient = require('../models/patient');
const Label = require("../models/label");


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

exports.getAllPatientLabelsFilter = (req, res) => {
    console.log("req.body:", req.body.filter)
    const [lastName, firstName] = req.body.filter.split(' ');

    console.log("lastName: ", lastName, "firstName: ", firstName);

    let orConditionsLastName;
    let orConditionsFirstName;

    if (lastName !== undefined) {
        const regexLastName = new RegExp(`\\b${lastName}`, "i");
        orConditionsLastName = [{lastName: {$regex: regexLastName}}, {firstName: {$regex: regexLastName}}];
    } else {
        orConditionsLastName = [{}]
    }

    if (firstName !== undefined) {
        const regexFirstName = new RegExp(`\\b${firstName}`, "i");
        orConditionsFirstName = [{lastName: {$regex: regexFirstName}}, {firstName: {$regex: regexFirstName}}];
    } else {
        orConditionsFirstName = [{}]
    }


    Patient.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    })
        .then(users => {
            const modifiedUsers = users.map(user => {
                return {
                    labelName: user.lastName + ' ' + user.firstName,
                };
            });
            res.status(200).json({labels: modifiedUsers, message: 'All the patients have been retrieved'});
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the patients'}));
};


exports.init100Patient = async (req, res) => {
    for (let i = 0; i < 100; i++) {
        const patientSave = new Patient({
            firstName: "emile" + i,
            lastName: "nom" + i,
            height: 1.7,
            weight: 65,
            birthDate: new Date(),
        });
        await patientSave.save()
    }
    res.status(200).json({"status": 200});
}
