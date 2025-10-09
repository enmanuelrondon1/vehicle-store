// src/components/features/admin/states/AdminPanelLoading.tsx

export const AdminPanelLoading = () => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="text-center space-y-4 max-w-sm w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="text-base md:text-lg">
        Cargando panel de administrador...
      </p>
    </div>
  </div>
);