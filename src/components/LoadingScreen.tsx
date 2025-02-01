import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          {/* Cercle principal */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          {/* Animation de chargement */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <div className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
          Chargement...
        </div>
      </div>
    </div>
  );
}
