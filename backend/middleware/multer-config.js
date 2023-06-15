const multer = require('multer');

const MIME_TYPES = {
    'audio/x-wav': 'wav',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'audioFiles');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '.' + extension);
    }
});

module.exports = multer({storage: storage}).single('audio');
