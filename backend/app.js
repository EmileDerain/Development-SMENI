const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
var cors = require('cors');


const audioRoutes = require("./routes/audio")
const cnnRoutes = require("./routes/cnn")

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

app.use('/audioFiles', express.static(path.join(__dirname, 'audioFiles')))

app.use("/api/audio", audioRoutes)
app.use("/api/cnn", cnnRoutes)

module.exports = app;
