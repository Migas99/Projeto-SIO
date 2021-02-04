const multer = require('multer');

//Multer storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/xml');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
    fileFilter: function (req, file, cb) {
        const allowedMimes = [
            'application/xml'
        ];

        if(allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    }
});

const upload = multer({ storage: storage });

module.exports = upload.single('file');