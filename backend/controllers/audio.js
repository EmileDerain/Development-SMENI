const Audio = require('../models/audio');
const Label = require('../models/label');

const fs = require("fs");

let ObjectId = require('mongodb').ObjectId;


const {getAudioDurationInSeconds} = require('get-audio-duration')
const config = require("../CNN/config/config");

exports.renameFile = async (req, res, next) => {
    const label = await Label.findById(new ObjectId(req.body.labelId))
        .select('labelName -_id');

    req.body.label = label.labelName;

    const date = Date.now();
    const path = label.labelName + "/" + req.body.filename.replace(" ", "_") + "_" + label.labelName + "_" + date + ".wav";

    fs.rename(req.file.path, "./CNN/dataStemoscope/Test/" + path, (err) => {
        if (err) {
            console.log("Error : file renamed and moved!");
            res.status(500).json({"status": 500, "reason": "Can't rename file"})
            throw err;
        } else {
            console.log("File renamed and moved!");
            req.file.path = path;
            req.file.filename = req.body.filename;
            next();
        }
    });
}

exports.saveAudio = async (req, res) => {
    console.log("req.file:", req.file);

    const duration = await getAudioDurationInSeconds("./CNN/dataStemoscope/Test/" + req.file.path).then((duration) => {
        return duration - 1;  //Difference of lib in the front and the back to calculate duration of a audio file
    })

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const audioFile = new Audio({
        audioName: req.file.filename,
        path: req.file.path,
        date: formattedDate,
        label: req.body.label,

        labelId: new ObjectId(req.body.labelId),
        doctorId: new ObjectId(req.body.doctorId),
        duration: Math.ceil(duration),

        patientId: new ObjectId(req.body.patientId),
        height: req.body.height,
        weight: req.body.weight,
        age: req.body.age,
        gender: req.body.gender,
        // comorbidities: req.body.comorbidities,
    });

    audioFile.save()
        .then(() => {
            console.log('Audio saved');
            res.status(201).json({"status": 201, message: 'Audio saved'})
        })
        .catch(error => {
            console.log('Audio error: ', error);
            res.status(400).json({"status": 201, reason: error})
        });
};

exports.getAllAudio = (req, res) => {
    console.log('use ?? getAllAudio')
    Audio.find()
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.get10Audio = async (req, res) => {
    console.log('use ?? get10Audio')

    const nbAudio = 11;
    const audioCount = await Audio.countDocuments();
    console.log("min", (parseInt(req.params.pageNumber) - 1) * nbAudio);
    console.log("max", parseInt(req.params.pageNumber) * nbAudio);

    Audio.find().skip((req.params.pageNumber - 1) * nbAudio).limit(nbAudio)
        .then(audios => res.status(200).json({
            "status": 200,
            "audioCount": Math.ceil(audioCount / nbAudio),
            "audios": audios
        }))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.getAudioFiltedBySection = async (req, res) => {
    console.log('use ?? getFilted10Audio')


    // console.log("req.body2:", req.body);
    const nbAudio = 11;

    const conditions = [
        {
            list: true,
            tabCondition: [],
            filterList: req.body.filter.label,
            key: "labelId",
        },
        {
            list: true,
            tabCondition: [],
            filterList: req.body.filter.doctor,
            key: "doctorId",
        },
        {
            list: true,
            tabCondition: [],
            filterList: req.body.filter.patient,
            key: "patientId",
        },
        {
            list: false,
            oneCondition: "",
            filterList: req.body.filter.age,
            key: "age",
        },
        {
            list: false,
            oneCondition: "",
            filterList: req.body.filter.weight,
            key: "weight",
        },
        {
            list: false,
            oneCondition: "",
            filterList: req.body.filter.height,
            key: "height",
        },
        {
            list: false,
            oneCondition: "",
            filterList: req.body.filter.gender,
            key: "gender",
        }
    ]

    const pageNumber = req.body.pageNumber;


    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i];
        const {key, filterList} = condition;

        if (condition.list) {
            console.log(condition.key)
            for (let j = 0; j < filterList.length; j++) {
                const filterItem = filterList[j];
                condition.tabCondition.push({[key]: new ObjectId(filterItem)});
            }
        } else {
            if (filterList !== '')
                condition.oneCondition = {[key]: filterList};
            else
                condition.oneCondition = {};
        }
    }

    const allConditions = [];

    for (let i = 0; i < conditions.length; i++) {
        const condition = conditions[i]; // Get the current condition object
        console.log(i, condition);
        if (!condition.list)
            allConditions.push(condition.oneCondition)
        else if (condition.tabCondition.length === 0)
            allConditions.push({})
        else
            allConditions.push({$or: condition.tabCondition})
    }

    // console.log(conditions[0].tabCondition);
    // console.log(conditions[1].tabCondition);
    // console.log(conditions[2].tabCondition);

    const audioCount = await Audio.find({
        $and: allConditions
    }).countDocuments();

    // console.log('Nb audioCount: ', audioCount)

    Audio.find({
        $and: allConditions
    }).skip((pageNumber - 1) * nbAudio).limit(nbAudio)
        .then(audios => res.status(200).json({
            "status": 200,
            "audioCount": Math.ceil(audioCount / nbAudio),
            "audios": audios
        }))
        .catch(error => {
            console.log(error);
            res.status(400).json({"status": 400, reason: error})
        });
};

exports.getAllAudioOfALabel = (req, res) => {
    console.log('use ?? getAllAudioOfALabel')


    Audio.find({label: req.params.label.toLowerCase()})
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.getAllAudioOfADoctor = (req, res) => {
    console.log('use ?? getAllAudioOfADoctor')


    Audio.find({doctor: req.params.doctor})
        .then(audios => res.status(200).json({"status": 200, "audios": audios}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.deleteAudio = (req, res) => {
    const {id} = req.query;

    Audio.findByIdAndDelete(id)
        .then(() => res.status(200).json({message: 'Audio delete !'}))
        .catch(error => res.status(400).json({error}));
};

exports.getPatientAudio = async (req, res) => {
    console.log('use ?? getAllAudioOfALabel')


    const sectionSize = config.sizeOfSection;
    const {id, page} = req.query;

    console.log("req.getPatientAudio:", id, page);


    const count = await Audio.find({
        patientId: new ObjectId(id)
    }).countDocuments();


    Audio.find({
        patientId: new ObjectId(id)
    }).skip((page - 1) * sectionSize).limit(sectionSize)
        .then(audios => res.status(200).json({
            "status": 200,
            "count": Math.ceil(count / sectionSize),
            "audios": audios
        }))
        .catch(error => {
            console.log(error);
            res.status(400).json({"status": 400, reason: error})
        });
};
