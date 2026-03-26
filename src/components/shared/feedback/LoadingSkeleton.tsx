// src/components/shared/feedback/LoadingSkeleton.tsx
"use client";

const VehicleCardSkeleton = () => (
  <div className="bg-card rounded-lg shadow-md overflow-hidden border border-border">
    <div className="bg-muted aspect-video animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
      <div className="flex justify-between items-end pt-2">
        <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-8 bg-muted animate-pulse rounded w-8" />
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen py-8 px-4 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Esqueleto de cabecera */}
        <div className="space-y-6">
          <div className="bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-grow w-full md:w-auto">
                <div className="h-10 bg-muted animate-pulse rounded-md w-full" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="h-10 bg-muted animate-pulse rounded-md w-28" />
                <div className="h-10 bg-muted animate-pulse rounded-md w-40" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 p-4 rounded-xl shadow-md bg-card/80 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted animate-pulse rounded" />
              <div className="h-5 bg-muted animate-pulse rounded w-32" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20" />
              <div className="h-4 bg-muted animate-pulse rounded w-12" />
            </div>
          </div>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <VehicleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;