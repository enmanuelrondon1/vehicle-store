// src/app/api/migrate-status/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ApprovalStatus } from "@/types/types";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");

    const result = await db.collection("vehicles").updateMany(
      { availability: { $exists: true } },
      [
        {
          $set: {
            status: {
              $cond: {
                if: { $eq: ["$availability", "PENDING"] },
                then: ApprovalStatus.PENDING,
                else: ApprovalStatus.APPROVED,
              },
            },
          },
        },
        { $unset: "availability" },
      ]
    );

    const result2 = await db.collection("vehicles").updateMany(
      { status: { $exists: false } },
      { $set: { status: ApprovalStatus.APPROVED } }
    );

    return NextResponse.json({
      success: true,
      message: `Actualizados ${result.modifiedCount} vehículos con availability y ${result2.modifiedCount} vehículos sin status`,
      modifiedCount: result.modifiedCount + result2.modifiedCount,
    });
  } catch (error) {
    console.error("Error al migrar status:", error);
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
    error: "Este endpoint solo acepta solicitudes POST. Usa `curl -X POST http://localhost:3000/api/migrate-status`.",
  });
}