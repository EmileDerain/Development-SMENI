const Audio = require('../models/audio');
const Label = require('../models/label');
const User = require('../models/user');

const fs = require("fs");

let ObjectId = require('mongodb').ObjectId;


const {getAudioDurationInSeconds} = require('get-audio-duration')
const config = require("../CNN/config/config");
const Patient = require("../models/patient");

exports.renameFile = async (req, res, next) => {
    const label = await Label.findById(new ObjectId(req.body.labelId))
        .select('labelName -_id');

    req.body.label = label.labelName;

    const date = Date.now();
    const path = label.labelName.toLowerCase() + "/" + req.body.filename.replace(" ", "_") + "_" + label.labelName + "_" + date + ".wav";

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

    const commonProperties = {
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
    };

    const audioFileData = req.body.note === undefined ? {...commonProperties} : {
        ...commonProperties,
        note: req.body.note
    };
    const audioFile = new Audio(audioFileData);

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

    console.log("sort")
    Audio.find({
        $and: allConditions
    }).skip((pageNumber - 1) * nbAudio)
        .limit(nbAudio)
        .sort('date')
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
    }).skip((page - 1) * sectionSize)
        .limit(sectionSize)
        .sort({'date': -1})
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

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function divideDate(date, numberOfDates) {
    const startDate = new Date(date);
    const endDate = new Date("2023-06-30");
    const interval = (endDate - startDate) / (numberOfDates + 1);

    const dividedDates = [];

    for (let i = 1; i < numberOfDates + 1; i++) {
        const newDate = new Date(startDate.getTime() + interval * i);
        dividedDates.push(newDate);
    }
    return dividedDates;
}

function calculateAge(dateOfBirth, currentDate) {
    const dateOfBirthObj = dateOfBirth;

    let age = currentDate.getFullYear() - dateOfBirthObj.getFullYear();

    // Check if the person's birthday has already occurred this year
    const currentMonth = currentDate.getMonth();
    const birthMonth = dateOfBirthObj.getMonth();
    const currentDay = currentDate.getDate();
    const birthDay = dateOfBirthObj.getDate();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
        age--;
    }

    return age;
}

const generateRandomText = (nombreMots) => {
    const mots = [
        "lorem", "ipsum", "dolor", "sit", "amet",
        "consectetur", "adipiscing", "elit", "sed",
        "do", "eiusmod", "tempor", "incididunt", "ut",
        "labore", "et", "dolore", "magna", "aliqua"
    ];
    let texteAleatoire = "";

    for (let i = 0; i < nombreMots; i++) {
        const motAleatoire = mots[Math.floor(Math.random() * mots.length)];
        texteAleatoire += motAleatoire + " ";
    }

    return texteAleatoire.trim(); // Pour supprimer l'espace final
};

exports.init100Audio = async (req, res) => {
    const audios = ["I_speak-soft_pressure-tee_shirt",
        "I_speak-with_tee_shirt",
        "I_speak-without_tee_shirt",
        "noiseless_with_tee_shirt",
        "noiseless_without_tee_shirt",
        "other_people_speak-tee_shirt"]

    const labelList = ["Murmur", "Normal", "Artifact", "Extrastole", "Extrahls"]
    const firstName = ["Anh", "Hông", "Kim", "Lôc", "Duong", "An"]
    const lastName = ["Nguyen", "Tran", "Le", "Pham", "Vu", "Ngo", "Do", "Hoang", "Dao", "Dang", "Duong", "Dinh"]

    const heightM = [76, 88, 96, 103, 110, 116, 122, 127, 133, 138, 143, 149, 156, 163, 169, 173, 175, 176]
    const weightM = [10, 12, 14, 16, 18, 21, 23, 25, 28, 31, 35, 39, 45, 51, 57, 62, 65, 67]

    const heightF = [74, 87, 95, 103, 109, 115, 121, 127, 133, 139, 145, 152, 157, 160, 162, 163, 163, 163]
    const weightF = [9, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 42, 47, 51, 53, 55, 55, 56]


    const lab = await Label.find()
        .then(labels => {
            return labels;
        })

    const dico = {
        [lab[0].labelName]: lab[0]._id,
        [lab[1].labelName]: lab[1]._id,
        [lab[2].labelName]: lab[2]._id,
        [lab[3].labelName]: lab[3]._id,
        [lab[4].labelName]: lab[4]._id,
    }

    const doctors = await User.find()
        .then(doctors => {
            return doctors;
        })


    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 12; j++) {
            const labelChoose1 = labelList[random(0, 4)]
            const labelChoose2 = labelList[random(0, 4)]

            console.log("labelChoose1", labelChoose1)
            console.log("labelChoose2", labelChoose2)

            const patient = await Patient.findOne({
                firstName: firstName[i],
                lastName: lastName[j]
            })
                .then(patient => {
                    return patient;
                })

            console.log(patient)
            console.log("patient.birthDate", patient.birthDate)

            const dividedDates = divideDate(patient.birthDate, 6);

            const doctorChoose = doctors[random(0, doctors.length - 1)]

            for (let k = 0; k < 5; k++) {

                const audioChoose = audios[k]
                let labelChoose;

                if (k < 3)
                    labelChoose = labelChoose1;
                else
                    labelChoose = labelChoose2;


                const filename = `audioInit${patient.lastName}-${random(0, 100)}`

                const date = Date.now();
                const path = `${labelChoose.toLowerCase()}/${audioChoose}_${labelChoose}_${date}.wav`
                const sourceFilePath = `./audioFilesInit/${audioChoose}.wav`;
                const destinationFilePath = `./CNN/dataStemoscope/Test/${path}`

                const note = generateRandomText(random(10, 100));


                await fs.copyFile(sourceFilePath, destinationFilePath, async (err) => {
                    if (err) {
                        console.log("Error: file copy failed!", err);
                        throw new Error('ror: file copy failed!', err);
                    } else {
                        console.log("File copied successfully!");

                        console.log("copyFileOK")

                        const duration = await getAudioDurationInSeconds("./CNN/dataStemoscope/Test/" + path).then((duration) => {
                            return duration - 1;
                        })

                        console.log("duration", duration)

                        const age = calculateAge(patient.birthDate, dividedDates[k]);
                        console.log("age", age)


                        let height;
                        let weight;

                        if (patient.gender === 1) {
                            height = heightF[age]
                            weight = weightF[age]
                        } else {
                            height = heightM[age]
                            weight = weightM[age]
                        }

                        const commonProperties = {
                            audioName: filename,
                            path: path,
                            date: dividedDates[k],
                            label: labelChoose,

                            labelId: new ObjectId(dico[labelChoose]),
                            doctorId: new ObjectId(doctorChoose._id),
                            duration: Math.ceil(duration),

                            patientId: new ObjectId(patient._id),
                            height: height,
                            weight: weight,
                            age: age,
                            gender: patient.gender,
                            // comorbidities: req.body.comorbidities,
                        };
                        let audioFileData;

                        if (random(0, 10) !== 0) {
                            audioFileData = {
                                ...commonProperties,
                                note: note
                            };
                        }else{
                            audioFileData = {
                                ...commonProperties
                            };
                        }

                        const audioFile = new Audio(audioFileData);

                        audioFile.save()
                    }
                });


            }
        }
    }
}
