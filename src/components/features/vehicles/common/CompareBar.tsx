// src/components/features/vehicles/common/CompareBar.tsx
"use client";

import type React from "react";
import { X } from "lucide-react";
import { IoMdGitCompare } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CompareBarProps {
  compareList: string[];
  setCompareList: (list: string[]) => void;
  // isDarkMode: boolean; // ❌ REMOVED
}

const CompareBar: React.FC<CompareBarProps> = ({
  compareList,
  setCompareList,
  // isDarkMode, // ❌ REMOVED
}) => {
  const router = useRouter();

  const handleCompare = () => {
    const params = new URLSearchParams();
    compareList.forEach((id) => params.append("vehicles", id));
    router.push(`/compare?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      <span className="text-sm text-muted-foreground">
        {compareList.length} vehículos para comparar
      </span>
      <Button onClick={handleCompare}>
        <IoMdGitCompare className="w-4 h-4 mr-2" />
        Comparar ({compareList.length})
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCompareList([])}
        title="Limpiar comparación"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CompareBar;