
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 ml-0 lg:ml-64 transition-all duration-300">
        <div className="flex items-center justify-center h-[calc(100vh-32px)]">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
            <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
            <Link 
              to="/" 
              className="text-blue-500 hover:text-blue-700 underline font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
