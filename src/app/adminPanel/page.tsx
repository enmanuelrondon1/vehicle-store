// src/app/adminPanel/page.tsx
// ✅ OPTIMIZADO: AdminPanel cargado con dynamic import (lazy loading).
//    El panel de admin es grande (~20 componentes) y solo lo usan administradores.
//    Con dynamic import, el bundle de admin NO se incluye en el JS inicial
//    que descargan todos los usuarios normales del sitio.

import ProtectedRoute from "@/components/features/auth/ProtectedRoute";
import dynamic from "next/dynamic";
import LoadingSkeleton from "@/components/shared/feedback/LoadingSkeleton";

// ❌ ANTES: import { AdminPanel } from "../../components/features/admin/AdminPanel";
// ✅ AHORA: carga el bundle de AdminPanel solo cuando el usuario llega a esta página
const AdminPanel = dynamic(
  () =>
    import("../../components/features/admin/AdminPanel").then(
      (mod) => mod.AdminPanel
    ),
  {
    loading: () => <LoadingSkeleton />,
    ssr: false, // El admin panel no necesita SSR — es una ruta protegida
  }
);

export default function AdminPanelPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  );
}