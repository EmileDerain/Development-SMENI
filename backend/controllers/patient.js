const Patient = require('../models/patient');
const Label = require("../models/label");
const Audio = require("../models/audio");
const config = require("../CNN/config/config");
const {ObjectId} = require("mongodb");


exports.createPatient = (req, res) => {
    console.log("req.body: ", req.body);
    const patient = new Patient({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        height: req.body.height,
        weight: req.body.weight,
        birthDate: req.body.birthDate,
        medicalID: req.body.medicalID,
        gender: req.body.gender,
    });
    patient.save()
        .then(() => res.status(201).json({message: 'Patient created !'}))
        .catch(error => res.status(400).json({error, message: 'Error while creating patient !'}));
};


exports.getPatientsByMedicalID = (req, res) => {
    const medicalID = req.body.medicalID;
    // regex to find all the patients that have the medicalID in their medicalID array
    Patient.find({medicalID: {$regex: medicalID}}).skip(0).limit(5)
        .then(patients => res.status(200).json({"patients": patients, message: 'The patients have been retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving the patients'}));
}

exports.getAllPatients = (req, res) => {
    const numberToSkip = req.body.numberPatientToSkip;
    Patient.find().skip(numberToSkip).limit(5)
        .then(patients => res.status(200).json({"patients": patients, message: 'All the patients have been retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the patients'}));
}

exports.getPatientByName = (req, res) => {
    Patient.find({$or: [{firstName: req.body.name}, {lastName: req.body.name}]})
        .then(patient => res.status(200).json({patient, message: 'Patient retrieved'}))
        .catch(error => res.status(400).json({error, message: 'Error while retrieving patient'}));
}

exports.getAllPatientLabelsFilter = async (req, res) => {
    console.log("getAllPatientLabelsFilter", req.body.filter)
    const nbLabel = 11;

    let lastName;
    let firstName;

    try {
        [lastName, firstName] = req.body.filter.split(' ');
    } catch (e) {

    }
    const {page} = req.query;

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
        $and: [{$or: orConditionsLastName}, {$or: orConditionsFirstName},]
    }).countDocuments();

    Patient.find({
        $and: [{$or: orConditionsLastName}, {$or: orConditionsFirstName},]
    }).select('lastName firstName _id')
        .sort('lastName')
        .skip((page - 1) * nbLabel).limit(nbLabel)
        .then(patients => {
            const modifiedUsers = patients.map(patient => {
                return {
                    _id: patient._id, labelName: patient.lastName + ' ' + patient.firstName,
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

exports.getAllPatientFilter = async (req, res) => {
    console.log("getAllPatientLabelsFilter", req.body.filter)
    const sectionSize = config.sizeOfSection;

    let lastName;
    let firstName;

    try {
        [lastName, firstName] = req.body.filter.split(' ');
    } catch (e) {

    }
    const {page} = req.query;

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

    const count = await Patient.find({
        $and: [{$or: orConditionsLastName}, {$or: orConditionsFirstName},]
    }).countDocuments();

    Patient.find({
        $and: [{$or: orConditionsLastName}, {$or: orConditionsFirstName},]
    }).sort('lastName')
        .skip((page - 1) * sectionSize).limit(sectionSize)
        .then(patients => {
            res.status(200).json({
                patients: patients,
                "count": Math.ceil(count / sectionSize),
                message: 'All the patients have been retrieved'
            });
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the patients'}));
};

exports.getPatient = async (req, res) => {
    console.log("getPatient", req.body.filter)

    const {id} = req.query;

    Patient.findById(new ObjectId(id))
        .then(patient => {
            if (!patient) {
                res.status(404).json({message: 'Patient not found'}); // Statut 404 si le patient n'est pas trouvé
            } else {
                res.status(200).json({
                    patient: patient, message: 'The patient has been retrieved'
                });
            }
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
            gender: i % 2 + 1,
            birthDate: new Date(),
            medicalID: 12342412 + i
        });
        await patientSave.save()
    }
    res.status(200).json({"status": 200});
}
