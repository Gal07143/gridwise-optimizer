import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-xl text-gray-600 mt-4">Page not found</p>
            <Link 
                to="/" 
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go back home
            </Link>
        </div>
    );
};

export default NotFound; 