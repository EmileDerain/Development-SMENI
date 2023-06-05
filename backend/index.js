// require('dotent').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');

const PORT = process.env.PORT || 6666 ;
const todoRoutes = require('./routes/todo');

// database connection
require('./config/database');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/api/todos', todoRoutes);

console.log("PORT: ",PORT)

// server running status
app.listen(7778, () => {
    // eslint-disable-next-line no-console
    console.log(`The app listening at http://localhost: 7778`)
});
