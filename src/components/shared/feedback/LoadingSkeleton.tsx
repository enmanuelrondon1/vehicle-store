// src/components/shared/feedback/LoadingSkeleton.tsx
"use client";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-12 w-96 mx-auto bg-muted animate-pulse rounded-lg mb-4" />
          <div className="h-6 w-64 mx-auto bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="bg-card animate-pulse rounded-lg h-96"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;