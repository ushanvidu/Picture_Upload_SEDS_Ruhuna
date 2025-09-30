import React from 'react';

const Header = ({ activeTab, setActiveTab }) => {
    return (
        <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">SEDS-RUHNA</h1>
                            <p className="text-sm text-gray-400">Space Photography</p>
                        </div>
                    </div>

                    {/* Navigation for mobile */}
                    <div className="flex md:hidden space-x-2">
                        <button
                            onClick={() => setActiveTab('gallery')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'gallery'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                            }`}
                        >
                            Gallery
                        </button>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                activeTab === 'upload'
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                            }`}
                        >
                            Upload
                        </button>
                    </div>

                    {/* Navigation for desktop - hidden in main App */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {/* Navigation is handled in App component for desktop */}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;