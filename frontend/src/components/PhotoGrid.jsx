import React, { useState, useEffect } from 'react';

const PhotoGrid = ({ photos }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const toggleDescription = (photoId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [photoId]: !prev[photoId]
        }));
    };

    const openFullscreen = (photo, index) => {
        setSelectedImage(photo);
        setCurrentIndex(index);
    };

    const closeFullscreen = () => {
        setSelectedImage(null);
        setCurrentIndex(0);
    };

    const navigateImage = (direction) => {
        const newIndex = direction === 'next'
            ? (currentIndex + 1) % photos.length
            : (currentIndex - 1 + photos.length) % photos.length;

        setCurrentIndex(newIndex);
        setSelectedImage(photos[newIndex]);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;

            if (e.key === 'Escape') {
                closeFullscreen();
            } else if (e.key === 'ArrowRight') {
                navigateImage('next');
            } else if (e.key === 'ArrowLeft') {
                navigateImage('prev');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, currentIndex, photos]);

    if (photos.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No photos found</div>
                <p className="text-gray-500">Upload the first photo to get started!</p>
            </div>
        );
    }

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                {photos.map((photo, index) => {
                    const isDescriptionLong = photo.description && photo.description.length > 100;
                    const isExpanded = expandedDescriptions[photo._id];
                    const displayDescription = isExpanded
                        ? photo.description
                        : (photo.description && photo.description.length > 100
                            ? photo.description.substring(0, 100) + '...'
                            : photo.description);

                    return (
                        <div
                            key={photo._id}
                            className="break-inside-avoid bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:shadow-2xl hover:border-primary-500 transition-all duration-300 group"
                        >
                            {/* Image Container */}
                            <div
                                className="relative overflow-hidden cursor-pointer"
                                onClick={() => openFullscreen(photo, index)}
                            >
                                <img
                                    src={photo.imageUrl}
                                    alt={photo.title}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                    loading="lazy"
                                />

                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                        photo.imageCatogory === 'mobilephoto'
                                            ? 'bg-blue-500/90 text-white'
                                            : 'bg-purple-500/90 text-white'
                                    }`}>
                                        {photo.imageCatogory === 'mobilephoto' ? '📱 Mobile' : '📷 DSLR'}
                                    </span>
                                </div>

                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white text-sm bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                                        Click to view
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-white text-base mb-2 line-clamp-2">
                                    {photo.title}
                                </h3>

                                {photo.imageType && (
                                    <div className="flex items-center space-x-1 text-xs text-gray-400 mb-2">
                                        <span>📷</span>
                                        <span className="truncate" title={photo.imageType}>
                                            {photo.imageType}
                                        </span>
                                    </div>
                                )}

                                {photo.description && (
                                    <div className="mb-3">
                                        <p className="text-gray-300 text-sm leading-relaxed">
                                            {displayDescription}
                                        </p>
                                        {isDescriptionLong && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDescription(photo._id);
                                                }}
                                                className="text-primary-400 hover:text-primary-300 text-xs mt-1 transition-colors duration-200"
                                            >
                                                {isExpanded ? 'See less' : 'See more'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                                            <span className="text-gray-400 flex-shrink-0">By:</span>
                                            <span className="text-white font-medium truncate">
                                                {photo.userName}
                                            </span>
                                        </div>
                                        <span className="text-gray-500 text-xs flex-shrink-0 ml-2">
                                            {new Date(photo.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {photo.tags && photo.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {photo.tags.slice(0, 2).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-dark-border text-gray-300 rounded text-xs border border-gray-600"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Enhanced Fullscreen Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeFullscreen}
                >
                    <div className="relative max-w-7xl max-h-full w-full" onClick={e => e.stopPropagation()}>
                        {/* Navigation Arrows */}
                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={() => navigateImage('prev')}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigateImage('next')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image Counter */}
                        {photos.length > 1 && (
                            <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                {currentIndex + 1} / {photos.length}
                            </div>
                        )}

                        {/* Image */}
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
                        />

                        {/* Image Info */}
                        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mt-4 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-3">{selectedImage.title}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-gray-300 leading-relaxed">{selectedImage.description}</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Photographer:</span>
                                        <span className="text-white font-medium">{selectedImage.userName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Camera:</span>
                                        <span className="text-white">{selectedImage.imageType}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Category:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            selectedImage.imageCatogory === 'mobilephoto'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-purple-500 text-white'
                                        }`}>
                                            {selectedImage.imageCatogory}
                                        </span>
                                    </div>
                                    {selectedImage.userUnivercity && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">University:</span>
                                            <span className="text-white">{selectedImage.userUnivercity}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedImage.tags && selectedImage.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {selectedImage.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-xs border border-primary-500/30"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PhotoGrid;