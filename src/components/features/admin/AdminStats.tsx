import { Card, CardContent } from "@/components/ui/card";
import { Car, AlertCircle, CheckCircle2, XSquare } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <Car className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-muted/20">
        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
            <p className="text-2xl font-bold text-accent">{stats.pending}</p>
          </div>
          <div className="p-2 rounded-lg bg-accent/20">
            <AlertCircle className="w-5 h-5 text-accent" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-primary/5">
        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Aprobados</p>
            <p className="text-2xl font-bold text-primary">{stats.approved}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border hover:shadow-md transition-shadow bg-destructive/5">
        <CardContent className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Rechazados</p>
            <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/10">
            <XSquare className="w-5 h-5 text-destructive" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};