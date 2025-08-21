// src/app/adminPanel/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsDashboard } from "@/components/features/admin/AnalyticsDashboard";
import { useDarkMode } from "@/context/DarkModeContext";
import { ArrowLeft, BarChart2 } from "lucide-react";

interface AnalyticsData {
  generalStats: {
    totalVehicles: number;
    averagePrice: number;
    totalViews: number;
  };
  statusCounts: { [key: string]: number };
  monthlyPublications: {
    _id: { year: number; month: number };
    count: number;
  }[];
  avgPriceByCategory: { _id: string; averagePrice: number; count: number }[];
}

export default function AdminDashboardPage() {
  const { isDarkMode } = useDarkMode();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/analytics");
        const result = await response.json();
        if (result.success) {
          setAnalyticsData(result.data);
        } else {
          console.error("Error fetching analytics:", result.error);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className={`min-h-screen p-2 sm:p-4 lg:p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart2 className="w-6 h-6 text-blue-500" />
                Dashboard de Analíticas
              </CardTitle>
              <Button asChild variant="outline">
                <Link href="/adminPanel">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Panel
                </Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
        {isLoading ? <p className="text-center p-8">Cargando analíticas...</p> : <AnalyticsDashboard data={analyticsData} isDarkMode={isDarkMode} />}
      </div>
    </div>
  );
}
