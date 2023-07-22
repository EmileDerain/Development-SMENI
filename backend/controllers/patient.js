const Patient = require('../models/patient');
const Label = require("../models/label");
const Audio = require("../models/audio");
const config = require("../CNN/config/config");
const {ObjectId} = require("mongodb");


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
        // .sort('lastName')
        .skip((page - 1) * nbLabel).limit(nbLabel)
        .then(patients => {
            // console.log('patients SEND ----------', patients);

            const modifiedUsers = patients.map(patient => {
                return {
                    _id: patient._id,
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
                    patient: patient,
                    message: 'The patient has been retrieved'
                });
            }
        })
        .catch(error => res.status(400).json({error, message: 'Error while retrieving all the patients'}));
};

exports.deletePatient = (req, res) => {
    const {id} = req.query;

    Patient.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: 'Patient delete !'}))
        .catch(error => res.status(400).json({error}));
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.init100Patient = async (req, res) => {

    const firstName = ["Anh", "Hông", "Kim", "Lôc", "Duong", "An"]
    const lastName = ["Nguyen", "Tran", "Le", "Pham", "Vu", "Ngo", "Do", "Hoang", "Dao", "Dang", "Duong", "Dinh"]

    const heightM = [76, 88, 96, 103, 110, 116, 122, 127, 133, 138, 143, 149, 156, 163, 169, 173, 175, 176]
    const weightM = [10, 12, 14, 16, 18, 21, 23, 25, 28, 31, 35, 39, 45, 51, 57, 62, 65, 67]

    const heightF = [74, 87, 95, 103, 109, 115, 121, 127, 133, 139, 145, 152, 157, 160, 162, 163, 163, 163]
    const weightF = [9, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 42, 47, 51, 53, 55, 55, 56]


    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 12; j++) {
            const year = random(1, 17);
            const gender = random(1, 2);
            const date = new Date(2023 - year, random(1, 12) - 1, random(1, 31));

            let factMul;
            let patientSave;

            if (gender === 1) {
                factMul = random(90, 15) / 100

                patientSave = new Patient({
                    firstName: firstName[i],
                    lastName: lastName[j],
                    height: heightF[year] * factMul,
                    weight: weightF[year] * factMul,
                    gender: gender,
                    birthDate: date,
                    medicalID: random(100000000, 999999999)
                });
            } else {
                factMul = random(95, 115) / 100

                patientSave = new Patient({
                    firstName: firstName[i],
                    lastName: lastName[j],
                    height: heightM[year] * factMul,
                    weight: weightM[year] * factMul,
                    gender: gender,
                    birthDate: date,
                    medicalID: random(100000000, 999999999)
                });
            }
            await patientSave.save()
        }
    }
    res.status(200).json({"status": 200});
}


