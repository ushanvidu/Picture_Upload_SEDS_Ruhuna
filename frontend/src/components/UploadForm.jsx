import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const UploadForm = ({ onUploadSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageCatogory: '',
        imageType: '',
        userPhonenumber: '',
        userName: '',
        userEmail: '',
        userUnivercity: '',
        tags: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select an image file');
            return;
        }

        if (!formData.imageCatogory) {
            toast.error('Please select a category');
            return;
        }

        setUploading(true);

        try {
            const submitData = new FormData();
            submitData.append('image', selectedFile);

            // Append all form fields
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            const response = await fetch('http://localhost:4000/api/upload', {
                method: 'POST',
                body: submitData,
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                toast.success('Photo uploaded successfully!');
                onUploadSuccess();
            } else {
                toast.error(result.message || 'Upload failed');
            }
        } catch (error) {
            toast.error('Error uploading photo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Upload Photo</h1>
                    <p className="text-gray-400">Share your space photography with the community</p>
                </div>
                <button
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Back to Gallery
                </button>
            </div>

            <form onSubmit={handleSubmit} className="card space-y-6">
                {/* Image Upload */}
                <div>
                    <label className="block text-white font-medium mb-3">
                        Photo Upload *
                    </label>
                    <div className="border-2 border-dashed border-dark-border rounded-lg p-6 text-center hover:border-primary-500 transition-colors duration-200">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            {previewUrl ? (
                                <div className="space-y-3">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="max-h-64 mx-auto rounded-lg"
                                    />
                                    <p className="text-green-400">Click to change photo</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="text-4xl">📸</div>
                                    <p className="text-white font-medium">Click to upload your photo</p>
                                    <p className="text-gray-400 text-sm">JPEG, PNG, GIF, WebP (Max 10MB)</p>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* Category Selection */}
                <div>
                    <label className="block text-white font-medium mb-3">
                        Category *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageCatogory: 'mobilephoto' }))}
                            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                                formData.imageCatogory === 'mobilephoto'
                                    ? 'border-primary-500 bg-primary-500 bg-opacity-10'
                                    : 'border-dark-border hover:border-primary-500'
                            }`}
                        >
                            <div className="text-2xl mb-2">📱</div>
                            <div className="font-medium text-white">Mobile Photo</div>
                            <div className="text-sm text-gray-400">Taken with smartphone</div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageCatogory: 'DSLR' }))}
                            className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                                formData.imageCatogory === 'DSLR'
                                    ? 'border-primary-500 bg-primary-500 bg-opacity-10'
                                    : 'border-dark-border hover:border-primary-500'
                            }`}
                        >
                            <div className="text-2xl mb-2">📷</div>
                            <div className="font-medium text-white">DSLR Camera</div>
                            <div className="text-sm text-gray-400">Professional camera</div>
                        </button>
                    </div>
                </div>

                {/* Photo Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Photo Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter photo title"
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white font-medium mb-2">
                            Camera Type *
                        </label>
                        <input
                            type="text"
                            name="imageType"
                            value={formData.imageType}
                            onChange={handleInputChange}
                            placeholder="e.g., iPhone 15, Nikon D850"
                            className="input-field"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your photo, equipment used, location, etc."
                        rows="4"
                        className="input-field"
                        required
                    />
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="e.g., milkyway, stars, moon, landscape"
                        className="input-field"
                    />
                </div>

                {/* User Information */}
                <div className="border-t border-dark-border pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="userPhonenumber"
                                value={formData.userPhonenumber}
                                onChange={handleInputChange}
                                placeholder="Enter your phone number"
                                className="input-field"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white font-medium mb-2">
                                University
                            </label>
                            <input
                                type="text"
                                name="userUnivercity"
                                value={formData.userUnivercity}
                                onChange={handleInputChange}
                                placeholder="Enter your university"
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary flex-1"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn-primary flex-1"
                        disabled={uploading || !selectedFile || !formData.imageCatogory}
                    >
                        {uploading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Uploading...</span>
                            </div>
                        ) : (
                            'Upload Photo'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadForm;