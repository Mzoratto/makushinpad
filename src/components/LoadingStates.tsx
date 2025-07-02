/**
 * Loading States Components
 * Consistent loading indicators throughout the application
 */

import React from 'react';
import { useTranslation } from 'gatsby-plugin-react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

/**
 * Reusable Loading Spinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'border-primary',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div 
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

/**
 * Full-screen Loading Overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message,
  className = '' 
}) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4 max-w-sm mx-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 text-center">
          {message || t('common:status.loading', 'Loading...')}
        </p>
      </div>
    </div>
  );
};

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Button with Loading State
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  children,
  loadingText,
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}) => {
  const { t } = useTranslation();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`btn flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      <span>
        {isLoading ? (loadingText || t('common:status.loading', 'Loading...')) : children}
      </span>
    </button>
  );
};

interface LoadingCardProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton Loading Cards for Product Lists
 */
export const LoadingCards: React.FC<LoadingCardProps> = ({ count = 6, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="h-64 bg-gray-200"></div>
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            
            {/* Subtitle */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            
            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
            
            {/* Price and button */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface LoadingPageProps {
  message?: string;
  showSpinner?: boolean;
}

/**
 * Full Page Loading State
 */
export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  message,
  showSpinner = true 
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        {showSpinner && <LoadingSpinner size="xl" />}
        <h2 className="text-xl font-semibold text-gray-700">
          {message || t('common:status.loading', 'Loading...')}
        </h2>
      </div>
    </div>
  );
};

interface LoadingInlineProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Inline Loading State
 */
export const LoadingInline: React.FC<LoadingInlineProps> = ({ 
  message,
  size = 'md',
  className = '' 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-center space-x-2 py-4 ${className}`}>
      <LoadingSpinner size={size} />
      <span className="text-gray-600">
        {message || t('common:status.loading', 'Loading...')}
      </span>
    </div>
  );
};

interface LoadingTableProps {
  rows?: number;
  columns?: number;
}

/**
 * Table Loading Skeleton
 */
export const LoadingTable: React.FC<LoadingTableProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      {/* Table header */}
      <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
      
      {/* Table rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default {
  LoadingSpinner,
  LoadingOverlay,
  LoadingButton,
  LoadingCards,
  LoadingPage,
  LoadingInline,
  LoadingTable
};
