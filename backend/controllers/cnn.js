const {spawn} = require('child_process');
const serverConf = require("../global/server");

const fs = require("fs");
const Audio = require("../models/audio");
const Model = require("../models/model");

exports.renameFile = (req, res, next) => {
    console.log("renameFile predict")
    try {
        const sourcePath = "./" + req.file.path;
        const destinationPath = "./CNN/temp/" + req.file.filename;

        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                throw err;
            }
            console.log("File copied to the new location!");

            fs.unlink(sourcePath, (err) => {
                if (err) {
                    throw err;
                }
                console.log("Old file removed!");
            });

            req.file.path = destinationPath;
            next();
        });
    } catch (e) {
        console.log("Multiple req")
    }
};

exports.getAllModel = (req, res) => {
    Model.find()
        .then(models => res.status(200).json({"status": 200, "models": models}))
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
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        serverConf.IO.emit("receive_cnn_logs", dataToSend);
        console.log(dataToSend);
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code === 0) {

            const lossAndAccuracyArray = JSON.parse(dataToSend);

            const loss = lossAndAccuracyArray[0];
            const accuracy = lossAndAccuracyArray[1];

            const model = {
                path: './CNN/models/' + req.body.name + '.h5',
                date: new Date().toDateString(),
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
    const python = spawn('python', ['./CNN/LSTM_Classification_model.py', req.file.path, './CNN/models/my_model_save.h5']);

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
            } catch (e) {
                console.log("Multiple req")
            }
        }
        // send data to browser
        res.send(JSON.parse(dataToSend));
    });
};

exports.deleteModel = (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({message: 'Model delete !'}))
        .catch(error => res.status(400).json({error}));
};
