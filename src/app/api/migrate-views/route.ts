// src/app/api/migrate-views/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() { // Permitimos GET para probar en el navegador
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const result = await db.collection("vehicles").updateMany(
      {},
      { $set: { views: 0 } },
      { upsert: false }
    );

    return NextResponse.json({
      success: true,
      message: `Actualización completada. Documentos afectados: ${result.modifiedCount}`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error al migrar views:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al migrar los views" },
      { status: 500 }
    );
  }
}