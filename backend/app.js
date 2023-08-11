const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
var cors = require('cors');

const {init} = require("./utils/init");


const audioRoutes = require("./routes/audio")
const cnnRoutes = require("./routes/cnn")
const userRoutes = require("./routes/user")
const patientRoutes = require("./routes/patient")
const adminRoutes = require("./routes/admin")

MONGO_URL = 'mongodb://' + process.env.USERNAME_MONGO + ':' + process.env.PASSWORD_MONGO + process.env.MONGO_URL

console.log('MONGO_URL: ', MONGO_URL)

mongoose.connect(MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !', e));

const app = express();

app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/audioFiles/:dir/:filename', (req, res) => {
    const dir = req.params.dir;
    const filename = req.params.filename;
    console.log("LET'S GOOOOO: ", dir + "/" + filename)
    const filePath = path.join(__dirname, '/CNN/dataStemoscope/Test/', dir, filename);
    res.sendFile(filePath);
});

app.use("/api/audio", audioRoutes);
app.use("/api/cnn", cnnRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/admin", adminRoutes);
init();

module.exports = app;
