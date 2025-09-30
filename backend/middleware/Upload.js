// const multer = require('multer');
// const path = require('path');
//
// // Configure multer for memory storage
// const storage = multer.memoryStorage();
//
// const fileFilter = (req, file, cb) => {
//     // Check file type
//     const allowedTypes = /jpeg|jpg|png|gif|webp|bmp|tiff/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
//
//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'));
//     }
// };
//
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB limit
//     },
//     fileFilter: fileFilter
// });
//
// module.exports = upload;


// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Use memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    console.log('📁 File received:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
    });

    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: fileFilter
});

// Add error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

module.exports = { upload, handleUploadErrors };