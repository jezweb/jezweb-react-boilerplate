import React from 'react';
import { useLoadingStore } from '../../stores/loading.store';
import { Spinner } from './Spinner';

export const LoadingOverlay: React.FC = () => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <Spinner size="60px" />
        <p className="text-center mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};