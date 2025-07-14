// src/app/api/migrate-views/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const result = await db
      .collection("vehicles")
      .updateMany({}, { $set: { views: 0 } }, { upsert: false });

    return NextResponse.json({
      success: true,
      message: `Actualización completada. Documentos afectados: ${result.modifiedCount}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error al migrar views:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Solo para pruebas locales
export async function GET() {
  return NextResponse.json({
    success: false,
    error:
      "Este endpoint solo acepta solicitudes POST. Usa `curl -X POST http://localhost:3000/api/migrate-views`.",
  });
}
