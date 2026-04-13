// src/app/adminPanel/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Loader2 } from "lucide-react";

// ✅ Recharts (~150KB) solo se descarga cuando el usuario llega a esta página
//    y además el componente ya está montado — no bloquea el render inicial.
const AnalyticsDashboard = dynamic(
  () =>
    import("@/components/features/admin/AnalyticsDashboard").then(
      (mod) => mod.AnalyticsDashboard
    ),
  {
    ssr: false,
    loading: () => (
      <Card className="shadow-sm border-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            </div>
            <p className="text-muted-foreground">Cargando analíticas...</p>
          </div>
        </CardContent>
      </Card>
    ),
  }
);

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/admin/analytics");
        const result = await res.json();
        if (result.success) {
          setAnalyticsData(result.data);
        } else {
          setError(result.error || "Error al cargar analíticas");
        }
      } catch {
        setError("Error de conexión al cargar analíticas");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3.5 rounded-2xl shadow-lg bg-gradient-to-br from-primary to-primary/80 ring-4 ring-primary/10">
              <BarChart3 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h2 className="text-3xl font-heading font-bold text-foreground tracking-tight">
                Dashboard de Analíticas
              </h2>
              <p className="text-base text-muted-foreground mt-0.5">
                Visualiza estadísticas y tendencias de la plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/adminPanel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Link>
          </Button>
        </div>

        {/* Content — AnalyticsDashboard maneja sus propios estados internamente */}
        <AnalyticsDashboard
          data={analyticsData}
          isLoading={isLoading}
          error={error ?? undefined}
        />
      </div>
    </div>
  );
}