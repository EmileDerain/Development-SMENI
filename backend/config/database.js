// Import the mongoose module
const mongoose = require('mongoose');

// Set up default mongoose connection
const mongoDB = process.env.MONGO_URL || null;

mongoose.connect('mongodb://root3:example4@localhost:27017/testEmile', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
});

// Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
