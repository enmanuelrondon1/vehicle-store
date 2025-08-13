import { AdminPanel } from "../../components/features/admin/AdminPanel";
import ProtectedRoute from "@/components/features/auth/ProtectedRoute";

export default function AdminPanelPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  );
}