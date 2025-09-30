const Photo = require('../models/Photo');
const cloudinary = require('../config/cloudinary');

// Upload photo to Cloudinary and save to MongoDB
const uploadPhoto = async (req, res) => {
    console.log('🎯 === UPLOAD PHOTO CONTROLLER STARTED ===');

    try {
        // Debug: Check if file exists
        console.log('📁 1. Checking if file exists in request...');
        console.log('   - req.file:', req.file ? '✅ EXISTS' : '❌ MISSING');

        if (req.file) {
            console.log('   📊 File details:', {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size + ' bytes',
                buffer: req.file.buffer ? `Buffer (${req.file.buffer.length} bytes)` : 'No buffer'
            });
        }

        if (!req.file) {
            console.log('❌ 1. FAILED: No file uploaded');
            console.log('   📦 Request body fields:', Object.keys(req.body));
            console.log('   🏷️  Request body data:', req.body);
            console.log('   📋 Headers - Content-Type:', req.headers['content-type']);

            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
                debug: {
                    receivedFields: Object.keys(req.body),
                    contentType: req.headers['content-type']
                }
            });
        }

        console.log('✅ 1. SUCCESS: File received');

        // Debug: Check request body
        console.log('📦 2. Checking request body data...');
        console.log('   - Title:', req.body.title || 'MISSING');
        console.log('   - Description:', req.body.description || 'MISSING');
        console.log('   - Image Category:', req.body.imageCatogory || 'MISSING');
        console.log('   - Image Type:', req.body.imageType || 'MISSING');
        console.log('   - User Name:', req.body.userName || 'MISSING');
        console.log('   - User Email:', req.body.userEmail || 'MISSING');
        console.log('   - User Phone:', req.body.userPhonenumber || 'MISSING');
        console.log('   - All body fields:', Object.keys(req.body));

        // Upload to Cloudinary
        console.log('☁️  3. Starting Cloudinary upload...');

        const uploadResult = await new Promise((resolve, reject) => {
            console.log('   📤 Creating Cloudinary upload stream...');

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'astro-photos',
                    transformation: [
                        { quality: 'auto', fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.log('❌ 3. FAILED: Cloudinary upload error:', error.message);
                        reject(error);
                    } else {
                        console.log('✅ 3. SUCCESS: Cloudinary upload completed');
                        console.log('   📷 Cloudinary response:', {
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            asset_id: result.asset_id,
                            format: result.format,
                            bytes: result.bytes,
                            width: result.width,
                            height: result.height
                        });
                        resolve(result);
                    }
                }
            );

            console.log('   🔄 Writing file buffer to Cloudinary stream...');
            console.log('   📊 Buffer size:', req.file.buffer.length + ' bytes');

            uploadStream.end(req.file.buffer);
            console.log('   ✅ Buffer written to stream');
        });

        // Create photo document in MongoDB
        console.log('💾 4. Creating MongoDB document...');

        const photoData = {
            title: req.body.title || 'Untitled',
            description: req.body.description,
            imageUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.asset_id,
            publicId: uploadResult.public_id,
            userPhonenumber: req.body.userPhonenumber,
            imageType: req.body.imageType,
            imageCatogory: req.body.imageCatogory,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            userUnivercity: req.body.userUnivercity || " ",
            tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
            uploadedBy: req.body.uploadedBy || 'anonymous'
        };

        console.log('   📝 Photo data to save:', {
            title: photoData.title,
            description: photoData.description,
            imageCategory: req.body.imageCatogory,
            imageType: photoData.imageType,
            userName: photoData.userName,
            tags: photoData.tags,
            userUniversity: photoData.userUnivercity
        });

        const photo = new Photo(photoData);

        console.log('   💿 Saving to MongoDB...');
        await photo.save();
        console.log('✅ 4. SUCCESS: Photo saved to MongoDB');
        console.log('   🆔 MongoDB ID:', photo._id);

        console.log('🎉 === UPLOAD COMPLETED SUCCESSFULLY ===');

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: photo
        });

    } catch (error) {
        console.error('💥 === UPLOAD FAILED WITH ERROR ===');
        console.error('   Error message:', error.message);
        console.error('   Error stack:', error.stack);
        console.error('   Error name:', error.name);

        // Log specific error types
        if (error.name === 'ValidationError') {
            console.error('   🚨 MongoDB Validation Error:', error.errors);
        }
        if (error.http_code) {
            console.error('   🚨 Cloudinary Error Code:', error.http_code);
        }

        res.status(500).json({
            success: false,
            message: 'Error uploading photo',
            error: error.message
        });
    }
};

// Get all photos
const getAllPhotos = async (req, res) => {
    console.log('📸 === GET ALL PHOTOS REQUEST ===');
    console.log('   📋 Query parameters:', req.query);

    try {
        const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

        console.log('   🔍 Fetching photos from MongoDB...');
        console.log('   📊 Pagination:', { page, limit, sort });

        const photos = await Photo.find()
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Photo.countDocuments();

        console.log('✅ SUCCESS: Retrieved', photos.length, 'photos');
        console.log('   📈 Total photos in DB:', total);

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
        console.error('❌ FAILED: Error fetching photos:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching photos',
            error: error.message
        });
    }
};

// Get single photo by ID
const getPhotoById = async (req, res) => {
    console.log('🔍 === GET PHOTO BY ID REQUEST ===');
    console.log('   🆔 Photo ID:', req.params.id);

    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            console.log('❌ Photo not found with ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        console.log('✅ SUCCESS: Found photo:', photo.title);
        res.json({
            success: true,
            data: photo
        });
    } catch (error) {
        console.error('❌ FAILED: Error fetching photo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching photo',
            error: error.message
        });
    }
};

// Delete photo from Cloudinary and MongoDB
const deletePhoto = async (req, res) => {
    console.log('🗑️  === DELETE PHOTO REQUEST ===');
    console.log('   🆔 Photo ID:', req.params.id);

    try {
        const photo = await Photo.findById(req.params.id);

        if (!photo) {
            console.log('❌ Photo not found with ID:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        console.log('   📷 Photo found:', {
            title: photo.title,
            publicId: photo.publicId,
            cloudinaryId: photo.cloudinaryId
        });

        // Delete from Cloudinary
        console.log('☁️  Deleting from Cloudinary...');
        const cloudinaryResult = await cloudinary.uploader.destroy(photo.publicId);
        console.log('   ✅ Cloudinary deletion result:', cloudinaryResult);

        // Delete from MongoDB
        console.log('💾 Deleting from MongoDB...');
        await Photo.findByIdAndDelete(req.params.id);
        console.log('✅ SUCCESS: Photo deleted from MongoDB');

        res.json({
            success: true,
            message: 'Photo deleted successfully',
            cloudinaryResult: cloudinaryResult
        });
    } catch (error) {
        console.error('❌ FAILED: Error deleting photo:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error deleting photo',
            error: error.message
        });
    }
};

// Search photos by tags or title
const searchPhotos = async (req, res) => {
    console.log('🔎 === SEARCH PHOTOS REQUEST ===');
    console.log('   🔍 Search query:', req.query.query);

    try {
        const { query } = req.query;

        console.log('   📝 Building search query...');
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $in: [new RegExp(query, 'i')] } }
            ]
        };

        console.log('   🎯 Search criteria:', searchQuery);

        const photos = await Photo.find(searchQuery).sort('-createdAt');

        console.log('✅ SUCCESS: Found', photos.length, 'matching photos');
        res.json({
            success: true,
            data: photos
        });
    } catch (error) {
        console.error('❌ FAILED: Error searching photos:', error.message);
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