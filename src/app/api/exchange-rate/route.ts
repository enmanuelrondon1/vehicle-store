import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

// Esta función le dice a Next.js que no guarde en caché el resultado de esta ruta,
// asegurando que siempre obtengamos la tasa más reciente.
export async function GET() {
  noStore(); // Previene el cacheo estático de la ruta

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    if (!apiKey) {
      throw new Error("La clave de API para la tasa de cambio no está configurada en el servidor.");
    }

    // La API nos dará todas las tasas con base en USD
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

    const response = await fetch(apiUrl, {
      // Cacheamos la respuesta por 4 horas (14400 segundos) para no agotar la cuota gratuita.
      // Puedes ajustar este tiempo según tus necesidades.
      next: { revalidate: 14400 },
    });

    if (!response.ok) {
      throw new Error(`Error al contactar el servicio de cambio: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.result === 'error') {
      throw new Error(`Error del servicio de cambio: ${data['error-type']}`);
    }

    const rate = data.conversion_rates.VES; // Obtenemos la tasa específica para Bolívares

    return NextResponse.json({ success: true, rate });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudo obtener la tasa de cambio' },
      { status: 500 }
    );
  }
}