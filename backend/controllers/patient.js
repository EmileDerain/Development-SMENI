const Patient = require('../models/patient');
const Label = require("../models/label");
const Audio = require("../models/audio");


exports.createPatient = (req, res) => {
    const patient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        height: req.body.height,
        weight: req.body.weight,
        birthDate: req.body.birthDate
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
    Patient.find({$or: [{firstName: req.body.name}, {lastName: req.body.name}]})
        .then(patient => res.status(200).json({patient, message: 'Patient retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving patient'}));
}

exports.getAllPatientLabelsFilter = async (req, res) => {
    console.log("req.filter:", req.body.filter)
    console.log("req.pageNumber:", req.body.pageNumber)

    const nbLabel = 11;

    let lastName;
    let firstName;
    try {
        [lastName, firstName] = req.body.filter.split(' ');
    } catch (e) {

    }
    const pageNumber = req.body.pageNumber;

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

    const patientCount = await Patient.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).countDocuments();

    Patient.find({
        $and: [
            {$or: orConditionsLastName},
            {$or: orConditionsFirstName},
        ]
    }).select('lastName firstName _id')
        .sort('lastName')
        .skip((pageNumber - 1) * nbLabel).limit(nbLabel)
        .then(patients => {
            const modifiedUsers = patients.map(patient => {
                return {
                    _id : patient._id,
                    labelName: patient.lastName + ' ' + patient.firstName,
                };
            });
            res.status(200).json({
                labels: modifiedUsers,
                labelCount: Math.ceil(patientCount / nbLabel),
                message: 'All the patients have been retrieved'
            });
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
