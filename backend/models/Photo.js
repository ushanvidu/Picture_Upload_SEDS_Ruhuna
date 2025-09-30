const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    tags: [{
        type: String,
        trim: true
    }],
    uploadedBy: {
        type: String,
        default: 'anonymous'
    }
}, {
    timestamps: true
});

// Index for better query performance
photoSchema.index({ createdAt: -1 });
photoSchema.index({ tags: 1 });

module.exports = mongoose.model('Photo', photoSchema);