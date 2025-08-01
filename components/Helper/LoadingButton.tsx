'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  loadingText = 'Loading...'
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
        disabled:bg-blue-400 disabled:cursor-not-allowed
        text-white font-semibold rounded-lg 
        transition-colors duration-200
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${className}
      `}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
