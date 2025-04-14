
import React from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, onRetry }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold text-red-500 mb-4">{title}</h2>
      <p className="text-white mb-4">{message}</p>
      {onRetry && (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onRetry}
        >
          Try again
        </button>
      )}
    </div>
  );
};
