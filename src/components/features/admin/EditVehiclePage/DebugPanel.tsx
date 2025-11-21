// src/components/features/admin/EditVehiclePage/DebugPanel.tsx

import { Bug, ChevronDown, TrendingUp, Package } from "lucide-react";

interface DebugPanelProps {
  apiResponse: any;
}

export function DebugPanel({ apiResponse }: DebugPanelProps) {
  if (!apiResponse || !apiResponse.data) {
    return null;
  }

  return (
    <details className="group relative">
      <summary className="flex items-center gap-2.5 cursor-pointer text-sm font-semibold bg-muted/50 hover:bg-muted border border-border/50 rounded-xl px-4 py-3 transition-all duration-300 list-none hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5">
        <div className="p-1.5 bg-primary/10 rounded-lg">
          <Bug className="w-4 h-4 text-primary" />
        </div>
        <span className="font-mono font-bold">Debug API</span>
        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-300 group-open:rotate-180 text-muted-foreground" />
      </summary>
      
      {/* 💎 Contenido del Popover Premium */}
      <div className="absolute z-50 mt-3 card-glass border border-border/50 rounded-2xl shadow-2xl w-[90vw] sm:w-[500px] left-0 sm:left-auto sm:right-0 animate-fade-in overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="relative">
              <div className="absolute inset-0 bg-success/20 rounded-lg blur-md"></div>
              <div className="relative p-2 bg-success/10 rounded-lg">
                <Bug className="w-5 h-5 text-success" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-lg text-gradient-primary">Información de Debug</h3>
              <p className="text-xs text-muted-foreground">Detalles técnicos del vehículo</p>
            </div>
          </div>
          
          <div className="space-y-2.5">
            <div className="group flex items-start gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all hover:shadow-sm">
              <span className="text-muted-foreground min-w-[90px] font-mono text-xs font-bold uppercase tracking-wider">ID:</span>
              <span className="text-foreground font-mono text-sm break-all">{apiResponse.data?._id}</span>
            </div>
            
            <div className="group flex items-start gap-3 p-3 bg-accent/5 hover:bg-accent/10 rounded-xl transition-all hover:shadow-sm border border-accent/10">
              <span className="text-muted-foreground min-w-[90px] font-mono text-xs font-bold uppercase tracking-wider">Vehículo:</span>
              <span className="text-foreground font-bold text-sm">{apiResponse.data?.brand} {apiResponse.data?.model} ({apiResponse.data?.year})</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <span className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider">Location</span>
                <span className="text-foreground font-mono text-sm">"{apiResponse.data?.location}"</span>
              </div>
              
              <div className="flex flex-col gap-2 p-3 bg-success/5 rounded-xl border border-success/10">
                <span className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-wider">Status</span>
                <span className="badge-success text-xs">{apiResponse.data?.status || 'active'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="group flex items-start gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all">
                <span className="text-muted-foreground min-w-[90px] font-mono text-xs font-bold uppercase tracking-wider">Email:</span>
                <span className="text-foreground font-mono text-sm">{apiResponse.data?.sellerContact?.email}</span>
              </div>
              
              <div className="group flex items-start gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all">
                <span className="text-muted-foreground min-w-[90px] font-mono text-xs font-bold uppercase tracking-wider">Phone:</span>
                <span className="text-foreground font-mono text-sm">{apiResponse.data?.sellerContact?.phone}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:shadow-md transition-all group">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground text-xs font-bold">Imágenes</span>
                </div>
                <span className="badge-accent font-bold">{apiResponse.data?.images?.length || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:shadow-md transition-all group">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-xs font-bold">Features</span>
                </div>
                <span className="badge-premium text-xs">{apiResponse.data?.features?.length || 0}</span>
              </div>
            </div>
          </div>
          
          <details className="mt-4 group/details">
            <summary className="cursor-pointer text-primary hover:text-accent transition-colors text-sm font-bold flex items-center gap-2 p-2 hover:bg-muted/30 rounded-lg">
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-open/details:rotate-180" />
              Ver objeto completo
            </summary>
            <div className="mt-3 p-4 bg-card/50 border border-border/50 rounded-xl overflow-hidden">
              <pre className="text-xs font-mono overflow-auto max-h-64 text-foreground/80 scrollbar-thin">
                <code>{JSON.stringify(apiResponse.data, null, 2)}</code>
              </pre>
            </div>
          </details>
        </div>
      </div>
    </details>
  );
}