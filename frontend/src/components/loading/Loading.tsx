import React, {type ReactNode } from 'react';

interface DetailsLoadingProps {
  isLoading: boolean;
  children?: ReactNode;
}

export const Loading = ({ isLoading, children }: DetailsLoadingProps) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-gray-100">
        <span className="text-gray-500 font-medium animate-pulse">
          Loading profile...
        </span>
      </div>
    );
  }

  return <>{children}</>;
};