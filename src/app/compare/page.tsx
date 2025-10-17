//src/app/compare/page.tsx
"use client";

import { Suspense } from "react";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";
import CompareView from "@/components/features/vehicles/compare/CompareView";

export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingSkeleton  />}>
      <CompareView />
    </Suspense>
  );
}