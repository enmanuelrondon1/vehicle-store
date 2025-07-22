// src/app/api/admin/analytics/route.ts
import { NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { VehicleService } from '@/services/vehicleService';

export const GET = withAdminAuth(async () => {
  try {
    console.log('API /api/admin/analytics: Recibiendo solicitud GET');
    const db = await getDb();
    const vehicleService = new VehicleService(db);
    
    const analyticsData = await vehicleService.getAnalyticsData();

    if (!analyticsData) {
      console.error('API /api/admin/analytics: No se pudieron obtener los datos de análisis.');
      return NextResponse.json({ success: false, error: 'No se pudieron obtener los datos de análisis' }, { status: 500 });
    }

    console.log('API /api/admin/analytics: Datos de análisis generados exitosamente.');
    return NextResponse.json({ success: true, data: analyticsData });

  } catch (error) {
    console.error('API /api/admin/analytics: Error en el servidor -', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 });
  }
});