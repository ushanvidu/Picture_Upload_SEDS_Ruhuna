const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
    },
    imageCatogory:{
        type: String,
        required: true,
    },
    imageType:{
        type: String,
        required: true,
    },
    userPhonenumber:{
        type: String,
        required: true,
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
    userName:{
        type: String,
        required: true,
    },
    userEmail:{
        type: String,
        required: true,
    },
    userUnivercity:{
        type: String,

    },
    // format: {
    //     type: String,
    //     required: true
    // },
    // size: {
    //     type: Number,
    //     required: true
    // },
    // width: {
    //     type: Number
    // },
    // height: {
    //     type: Number
    // },
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