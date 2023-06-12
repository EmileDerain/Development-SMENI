const express = require('express');
const fs = require('fs');
const app = express();

app.get('/audio/', (req, res) => {

});

app.listen(3000, () => {
    console.log('Serveur de streaming audio démarré sur le port 3000');
});
