const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Upload photo to Cloudinary and save to MongoDB
const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'astro-photos', // Optional folder in Cloudinary
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            uploadStream.end(req.file.buffer);
        });

        // Create photo_document in MongoDB
        const photo = new Photo({
            title: req.body.title || 'Untitled',
            description: req.body.description ,
            imageUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.asset_id,
            publicId: uploadResult.public_id,
            // format: uploadResult.format,
            imageType: req.body.imageType,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userUnivercity: req.body.userUnivercity||" ",
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            uploadedBy: req.body.uploadedBy || 'anonymous'
        });

        await photo.save();

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: photo
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading photo',
            error: error.message
        });
    }
};

// Get all photos
const getAllPhotos = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        const photos = await Photo.find()
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Photo.countDocuments();

        res.json({
            success: true,
            data: photos,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalPhotos: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching photos',
            error: error.message
        });
    }
};

// Get single photo by ID
const getPhotoById = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        res.json({
            success: true,
            data: photo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching photo',
            error: error.message
        });
    }
};

// Delete photo from Cloudinary and MongoDB
const deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(photo.publicId);

        // Delete from MongoDB
        await Photo.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting photo',
            error: error.message
        });
    }
};

// Search photos by tags or title
const searchPhotos = async (req, res) => {
    try {
        const { query } = req.query;

        const photos = await Photo.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        }).sort('-createdAt');

        res.json({
            success: true,
            data: photos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching photos',
            error: error.message
        });
    }
};

module.exports = {
    uploadPhoto,
    getAllPhotos,
    getPhotoById,
    deletePhoto,
    searchPhotos
};