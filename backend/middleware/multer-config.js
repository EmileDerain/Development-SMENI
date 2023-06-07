const multer = require('multer');

const MIME_TYPES = {
    'audio/x-wav': 'wav',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log('test')
        callback(null, 'audioFiles');
    },
    filename: (req, file, callback) => {
        console.log('test: ', file)
        const name = file.originalname.split(' ').join('_');
        console.log("TYPE FILES: " + file.mimetype);
        const extension = MIME_TYPES[file.mimetype];
        // callback(null, name + Date.now() + '.' + extension);
        callback(null, file.originalname);    }
});

module.exports = multer({storage: storage}).single('audio');
