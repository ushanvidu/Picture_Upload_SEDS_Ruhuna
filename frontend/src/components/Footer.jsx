import React from 'react';

const Footer = ({ photos = [] }) => {
    const currentYear = new Date().getFullYear();

    // Calculate statistics
    const totalPhotos = photos.length;
    const mobilePhotos = photos.filter(photo => photo.imageCatogory === 'mobilephoto').length;
    const dslrPhotos = photos.filter(photo => photo.imageCatogory === 'DSLR').length;

    return (
        <footer className="bg-dark-card border-t border-dark-border mt-16">
            <div className="container mx-auto px-4 py-8">
                {/* Statistics Bar - Single Row on Desktop */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-center w-full sm:w-auto sm:min-w-[120px]">
                        <div className="text-2xl font-bold text-primary-400">{totalPhotos}</div>
                        <div className="text-gray-400 text-sm">Total Photos</div>
                    </div>
                    <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-center w-full sm:w-auto sm:min-w-[120px]">
                        <div className="text-2xl font-bold text-blue-400">{mobilePhotos}</div>
                        <div className="text-gray-400 text-sm">Mobile Photos</div>
                    </div>
                    <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-center w-full sm:w-auto sm:min-w-[120px]">
                        <div className="text-2xl font-bold text-purple-400">{dslrPhotos}</div>
                        <div className="text-gray-400 text-sm">DSLR Photos</div>
                    </div>
                </div>

                {/* Main Footer Content - Two Columns Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Mission Statement - Left Column */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-lg">Our Mission</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                To inspire and connect space photography enthusiasts through the sharing
                                of celestial wonders captured from Earth. Join us in exploring the universe
                                through your lens.
                            </p>
                        </div>


                    </div>



                    {/* SEDS Websites */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-lg">SEDS Ruhuna Websites</h4>
                        <div className="space-y-3">
                            <a
                                href="https://www.sedsruhuna.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-primary-400 hover:text-primary-300 transition-colors duration-200 text-sm"
                            >
                                SEDS Ruhuna Website
                            </a>
                            <a
                                href="https://nexus.sedsruhuna.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-primary-400 hover:text-primary-300 transition-colors duration-200 text-sm"
                            >
                                SEDS Ruhuna Nexus
                            </a>
                        </div>
                    </div>




                </div>

                {/* Bottom Bar */}
                <div className="border-t border-dark-border pt-6 flex flex-col lg:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 lg:mb-0 text-center lg:text-left">
                        © {currentYear} SEDS RUHNA Space Photography • Exploring the cosmos, one photo at a time
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;