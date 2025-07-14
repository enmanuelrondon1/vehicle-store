import { AdminPanel } from "../../components/sections/AdminPanel/AdminPanel";
import ProtectedRoute from "@/components/sections/ProtectedRoute/ProtectedRoute";

export default function AdminPanelPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminPanel />
    </ProtectedRoute>
  );
}