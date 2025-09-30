import React from 'react';

const FilterBar = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        { key: 'all', label: 'All Photos', emoji: '🌌' },
        { key: 'mobilephoto', label: 'Mobile Photos', emoji: '📱' },
        { key: 'DSLR', label: 'DSLR Photos', emoji: '📷' }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(filter => (
                <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                        activeFilter === filter.key
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-card text-gray-300 hover:bg-dark-border'
                    }`}
                >
                    <span>{filter.emoji}</span>
                    <span>{filter.label}</span>
                </button>
            ))}
        </div>
    );
};

export default FilterBar;