const express = require('express');
const router = express.Router();
const {
  uploadPhoto,
  getAllPhotos,
  getPhotoById,
  deletePhoto,
  searchPhotos
} = require('../controllers/photoController');
const { upload, handleUploadErrors } = require('../middleware/upload');

// Upload photo
router.post('/upload',
    upload.single('image'), // 'image' must match the field name in Postman
    handleUploadErrors,
    uploadPhoto
);
// Get all photos with pagination
router.get('/photos', getAllPhotos);

// Search photos
router.get('/photos/search', searchPhotos);

// Get single photo
router.get('/photos/:id', getPhotoById);

// Delete photo
router.delete('/photos/:id', deletePhoto);

module.exports = router;