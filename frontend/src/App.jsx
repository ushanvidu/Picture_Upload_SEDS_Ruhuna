import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PhotoGrid from './components/PhotoGrid';
import UploadForm from './components/UploadForm';
import FilterBar from './components/FilterBar';
import { Toaster, toast } from 'react-hot-toast';

// Import your logo from assets folder
import logo from '../src/assets/logo.png';
import Footer from "./components/Footer.jsx";

function App() {
    const [activeTab, setActiveTab] = useState('gallery');
    const [activeFilter, setActiveFilter] = useState('all');
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch photos from backend
    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:4000/api/photos');
            const data = await response.json();

            if (data.success) {
                setPhotos(data.data);
            } else {
                toast.error('Failed to fetch photos');
            }
        } catch (error) {
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const filteredPhotos = activeFilter === 'all'
        ? photos
        : photos.filter(photo => photo.imageCatogory === activeFilter);

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text">
            <main className="container mx-auto px-4 py-8">
                {activeTab === 'gallery' ? (
                    <>
                        {/* Header Section with Logo and Title */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                {/* Logo from assets folder */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                                        <img
                                            src={logo}
                                            alt="SEDS-RUHNA Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                                        SEDS-RUHNA SPACE Photography
                                    </h1>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        Capture the cosmos through your lens
                                    </p>
                                </div>
                            </div>

                            {/* Desktop Upload Button */}
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="btn-primary hidden md:flex items-center space-x-2"
                            >
                                <span>📸</span>
                                <span>Upload Photo</span>
                            </button>
                        </div>

                        {/* Mobile Upload Button - Below Title */}
                        <div className="md:hidden flex justify-center mb-6">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className="btn-primary flex items-center space-x-2 w-full max-w-xs justify-center"
                            >
                                <span>📸</span>
                                <span>Upload Photo</span>
                            </button>
                        </div>

                        <FilterBar
                            activeFilter={activeFilter}
                            setActiveFilter={setActiveFilter}
                        />

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            <PhotoGrid photos={filteredPhotos} />
                        )}
                    </>
                ) : (
                    <UploadForm
                        onUploadSuccess={() => {
                            setActiveTab('gallery');
                            fetchPhotos();
                            toast.success('Photo uploaded successfully!');
                        }}
                        onCancel={() => setActiveTab('gallery')}
                    />
                )}
            </main>

            <Footer photos={photos} />


            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-dark-card border border-dark-border text-white',
                    duration: 3000,
                }}
            />
        </div>
    );
}

export default App;