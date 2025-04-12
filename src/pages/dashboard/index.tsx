import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add dashboard widgets and components here */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Overview</h2>
                    <p className="text-gray-600">Dashboard content will go here</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 