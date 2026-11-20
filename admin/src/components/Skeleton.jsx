import React from 'react';

const Skeleton = ({ variant = 'product', count = 6 }) => {
  if (variant === 'product') {
    return (
      <div className="bg-white rounded-card border border-border overflow-hidden">
        <div className="aspect-square bg-gray-200 animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
        </div>
      </div>
    );
  }
  if (variant === 'text') {
    return <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />;
  }
  return null;
};

export default Skeleton;