const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const audioRoutes = require("./routes/audio")

mongoose.connect('mongodb://root:example@localhost:27017',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log('Connexion à MongoDB échouée !', e));

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/audioFiles', express.static(path.join(__dirname, 'audioFiles')))

app.use("/api/audio", audioRoutes)


module.exports = app;
