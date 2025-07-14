//src/components/sections/VehicleList/LoadingSkeleton.tsx
"use client";

import type React from "react";


interface LoadingSkeletonProps {
  isDarkMode: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ isDarkMode }) => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={`h-12 w-96 mx-auto ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse rounded-lg mb-4`}
          />
          <div
            className={`h-6 w-64 mx-auto ${
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            } animate-pulse rounded`}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } animate-pulse rounded-lg h-96`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;