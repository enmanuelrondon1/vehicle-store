// src/components/features/vehicles/reels/ReelsAnalyticsDashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Eye, Heart, Share2, MousePointerClick, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsSummary {
  totalViews: number;
  completeViews: number;
  avgDuration: number;
  completionRate: number;
}

interface VehicleAnalytics {
  vehicleId: string;
  views: number;
  completeViews: number;
  totalDuration: number;
}

export const ReelsAnalyticsDashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topVehicles, setTopVehicles] = useState<VehicleAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics/reels?days=7");
      const data = await response.json();
      
      if (data.success) {
        setSummary(data.data.summary);
        setTopVehicles(data.data.topVehicles);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-muted animate-pulse rounded-lg" />
          <div className="h-24 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Analytics de Reels</h2>
          <p className="text-sm text-muted-foreground">Últimos 7 días</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vistas</p>
                <p className="text-2xl font-bold">{summary.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vistas Completas</p>
                <p className="text-2xl font-bold">{summary.completeViews.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-1">
                  {summary.completionRate}% tasa
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10">
                <MousePointerClick className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duración Promedio</p>
                <p className="text-2xl font-bold">{formatDuration(summary.avgDuration)}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Heart className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">
                  {((summary.completeViews / summary.totalViews) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Vehicles */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Vehículos Más Vistos
        </h3>
        <div className="space-y-3">
          {topVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.vehicleId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">Vehículo #{vehicle.vehicleId.slice(-6)}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.completeViews} vistas completas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{vehicle.views} vistas</p>
                <p className="text-sm text-muted-foreground">
                  {formatDuration(vehicle.totalDuration / vehicle.views)} promedio
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReelsAnalyticsDashboard;