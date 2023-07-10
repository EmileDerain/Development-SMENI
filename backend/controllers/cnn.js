const {spawn} = require('child_process');
const serverConf = require("../global/server");
const config = require("../CNN/config/config");


const fs = require("fs");
const Label = require("../models/label");
const Model = require("../models/model");

exports.renameFile = (req, res, next) => {
    console.log("renameFile predict")
    try {
        const sourcePath = "./" + req.file.path;
        const destinationPath = "./CNN/temp/" + req.file.filename;

        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.log("NOT - File copied to the new location!");
                // throw err;
            }
            console.log("File copied to the new location!");


            fs.unlink(sourcePath, (err) => {
                if (err) {
                    console.log("NOT - Old file removed!");
                    // throw err;
                }
                console.log("Old file removed!");
            });

            req.file.path = destinationPath;
            next();
        });
    } catch (e) {
        console.log("Multiple req", e)
    }
};

exports.getAllModel = (req, res) => {
    Model.find()
        .then(models => res.status(200).json({
            "status": 200,
            "models": models,
            "selectedModel": JSON.parse(fs.readFileSync('./CNN/config/selectedModel.json', 'utf-8'))
        }))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.selectModel = (req, res) => {
    console.log('selectModel')
    Model.findById(req.body._id)
        .then(model => {

            const json = JSON.stringify(model, null, 2);
            fs.writeFileSync('./CNN/config/selectedModel.json', json);

            res.status(200).json({
                "status": 200,
            });
        })
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.initLabels = async (req, res) => {
    const labelList = ["Murmur", "Normal", "Artifact", "Extrastole", "Extrahls"]
    for (const label of labelList) {
        console.log(label);
        const labelSave = new Label({
            labelName: label,
        });
        await labelSave.save()
    }
    res.status(200).json({"status": 200});
}


exports.getAllLabels = (req, res) => {
    Label.find().select('labelName -_id').sort('labelName')
        // Label.find().select('labelName')
        .then(labels => res.status(200).json({"status": 200, "labels": labels}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};

exports.getAllLabelsFilter = (req, res) => {
    console.log("req.body:", req.body.filter)
    const label = req.body.filter;
    const regexLabel = new RegExp(`\\b${label}`, "i");

    Label.find({
        labelName: {$regex: regexLabel}
    }).select('labelName -_id').sort('labelName')
        // Label.find().select('labelName')
        .then(labels => res.status(200).json({"status": 200, "labels": labels}))
        .catch(error => res.status(400).json({"status": 400, reason: error}));
};


exports.train = async (req, res) => {
    console.log('RUN train');

    var dataToSend;

    console.log("modelName: ", req.body.name)

    if (req.body.name === undefined) {
        res.status(400).json({"status": 400, message: 'Model name undefined'})
        return;
    }

    const model = new Model({
        modelName: req.body.name,
    });
    const model_save = await model.save()
        .then(() => {
            res.status(201).json({"status": 201, message: 'Start building a new model'});
            return true;
        })
        .catch(error => {
            res.status(400).json({"status": 201, reason: error});
            return false;
        });

    if (!model_save)
        return;

    serverConf.IO.emit("receive_cnn_logs", "Start building a new model");
    console.log('IO.emit');

    const python = spawn('python', ['CNN/LSTM_Classification.py', req.body.name]);

    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...: ');
        dataToSend = data.toString();
        // console.log('dataToSend[]', dataToSend.split("\n"))
        const dataToSendTab = dataToSend.split("\r\n");
        for (let i = 0; i < dataToSendTab.length; i++) {
            serverConf.IO.emit("receive_cnn_logs", dataToSendTab[i]);
        }

        // serverConf.IO.emit("receive_cnn_logs", dataToSend);
        // console.log(dataToSend);
        console.log("serverConf.IO.emit");
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0) {

            serverConf.IO.emit("end_cnn_logs");

            const lossAndAccuracyArray = JSON.parse(dataToSend);

            const loss = lossAndAccuracyArray[0];
            const accuracy = lossAndAccuracyArray[1];

            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
            const year = date.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;

            const model = {
                path: './CNN/models/' + req.body.name + '.h5',
                date: formattedDate,
                loss: loss,
                accuracy: accuracy,
            };

            console.log("req.body.name; ", req.body.name)

            Model.findOneAndUpdate(
                {modelName: req.body.name},
                {$set: model},
                {new: true}
            ).then(updatedModel => {
                if (updatedModel) {
                    console.log("Document updated:", updatedModel);
                } else {
                    console.log("No matching document found");
                }
            }).catch(error => {
                console.error("Error updating the document:", error);
            });
        }
    });
};


exports.predict = async (req, res) => {
    console.log("Predict: ", req.file.path);

    //TODO : change path in database !

    const modelPath = JSON.parse(fs.readFileSync('./CNN/config/selectedModel.json', 'utf-8')).path

    console.log("prediction use ", modelPath)

    const python = spawn('python', ['./CNN/LSTM_Classification_model.py', req.file.path, modelPath]);

    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend);
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0) {
            try {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log('Le fichier a été supprimé avec succès: ', req.file.path);
                });

                res.send(JSON.parse(dataToSend));
            } catch (e) {
                console.log("Multiple req", e)
            }
        } else {
            // send data to browser
            res.send(JSON.parse('{"label_1": {"label": "normal", "accuracy": 95.78}, "label_2": {"label": "murmur", "accuracy": 3.67}}'));
        }
    });
};

exports.deleteModel = (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({message: 'Model delete !'}))
        .catch(error => res.status(400).json({error}));
};
