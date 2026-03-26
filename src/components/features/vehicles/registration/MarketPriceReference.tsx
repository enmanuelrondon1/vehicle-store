// src/components/features/vehicles/registration/MarketPriceReference.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, AlertCircle, Loader2, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ===========================================
// TIPOS
// ===========================================
interface MarketPriceData {
  avg: number;
  min: number;
  max: number;
  count: number;
  scope: "exact" | "brand";
}

interface MarketPriceReferenceProps {
  brand?: string;
  model?: string;
  year?: number;
  currentPrice?: number;
}

// ===========================================
// HELPERS
// ===========================================
const formatUSD = (value: number) =>
  `$${value.toLocaleString("es-VE")} USD`;

const getPricePosition = (price: number, min: number, max: number): number => {
  if (max === min) return 50;
  return Math.min(100, Math.max(0, ((price - min) / (max - min)) * 100));
};

const getPriceStatus = (price: number, avg: number) => {
  const diff = ((price - avg) / avg) * 100;
  if (diff < -15) return { label: "Por debajo del mercado", color: "text-blue-400",  icon: TrendingDown, badgeVariant: "secondary" as const };
  if (diff > 15)  return { label: "Por encima del mercado", color: "text-orange-400", icon: TrendingUp,   badgeVariant: "secondary" as const };
  return           { label: "Precio competitivo",           color: "text-green-400",  icon: Minus,        badgeVariant: "secondary" as const };
};

// ===========================================
// COMPONENTE
// ===========================================
const MarketPriceReference: React.FC<MarketPriceReferenceProps> = ({
  brand,
  model,
  year,
  currentPrice,
}) => {
  const [data, setData]       = useState<MarketPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const abortRef              = useRef<AbortController | null>(null);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Limpiar timer anterior
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!brand || !model) {
      setData(null);
      setError(null);
      return;
    }

    // Debounce 800ms para no llamar la API en cada keystroke
    debounceRef.current = setTimeout(async () => {
      // Cancelar petición anterior si sigue en vuelo
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ brand, model });
        if (year) params.set("year", String(year));

        const res = await fetch(`/api/vehicles/market-price?${params}`, {
          signal: abortRef.current.signal,
        });
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
        } else {
          setData(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return; // cancelado, ignorar
        setError("No se pudo obtener la referencia de mercado");
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [brand, model, year]);

  // Nada que mostrar aún
  if (!brand || !model) return null;

  // Cargando
  if (loading) {
    return (
      <Card className="card-glass border-border/50 overflow-hidden animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Consultando precios del mercado...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error leve — no bloquear, solo omitir
  if (error) return null;

  // Sin datos suficientes
  if (!data) return null;

  const priceStatus     = currentPrice ? getPriceStatus(currentPrice, data.avg) : null;
  const StatusIcon      = priceStatus?.icon;
  const pricePosition   = currentPrice ? getPricePosition(currentPrice, data.min, data.max) : null;
  const scopeLabel      = data.scope === "exact"
    ? `${brand} ${model}${year ? ` (${year} ±2 años)` : ""}`
    : `${brand} (modelos similares)`;

  return (
    <Card className="card-glass border-primary/20 overflow-hidden animate-fade-in">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Referencia de Mercado
              </h3>
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {data.count} {data.count === 1 ? "anuncio" : "anuncios"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 ml-8">
            Basado en: <span className="text-foreground font-medium">{scopeLabel}</span>
          </p>
        </div>

        <div className="p-5 space-y-5">
          {/* Precios min / avg / max */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mínimo</p>
              <p className="text-sm font-semibold text-foreground">{formatUSD(data.min)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Promedio</p>
              <p className="text-base font-bold text-primary">{formatUSD(data.avg)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Máximo</p>
              <p className="text-sm font-semibold text-foreground">{formatUSD(data.max)}</p>
            </div>
          </div>

          {/* Barra de rango con posición del precio actual */}
          <div className="space-y-2">
            <div className="relative h-2 bg-muted rounded-full overflow-visible">
              {/* Gradiente del rango */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/40 via-green-500/40 to-orange-500/40" />
              {/* Marcador de precio actual */}
              {pricePosition !== null && currentPrice && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${pricePosition}%` }}
                >
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg" />
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Más bajo</span>
              <span>Más alto</span>
            </div>
          </div>

          {/* Estado del precio actual */}
          {priceStatus && StatusIcon && currentPrice && (
            <div className={`flex items-center gap-2 p-3 rounded-xl bg-muted/30 border border-border/50`}>
              <StatusIcon className={`w-4 h-4 ${priceStatus.color} flex-shrink-0`} />
              <div className="flex-1">
                <span className={`text-sm font-medium ${priceStatus.color}`}>
                  {priceStatus.label}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentPrice < data.avg
                    ? `${formatUSD(data.avg - currentPrice)} por debajo del promedio`
                    : currentPrice > data.avg
                    ? `${formatUSD(currentPrice - data.avg)} por encima del promedio`
                    : "Tu precio coincide con el promedio del mercado"}
                </p>
              </div>
            </div>
          )}

          {/* Sugerencia si no hay precio aún */}
          {!currentPrice && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/20">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
              <span>
                Ingresa tu precio arriba para ver cómo se compara con el mercado.
                El promedio para este vehículo es <strong className="text-foreground">{formatUSD(data.avg)}</strong>.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPriceReference;