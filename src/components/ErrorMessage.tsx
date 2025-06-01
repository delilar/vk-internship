import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        <span className="text-red-800">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-red-400 hover:text-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ErrorMessage;