// src/app/api/admin/users/[id]/vehicles/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function getUserIdFromURL(req: NextRequest): string | null {
  const pathParts = req.nextUrl.pathname.split("/");
  // /api/admin/users/[id]/vehicles → ["", "api", "admin", "users", id, "vehicles"]
  const vehiclesIndex = pathParts.indexOf("vehicles");
  if (vehiclesIndex > 0) {
    return pathParts[vehiclesIndex - 1];
  }
  return null;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Acceso no autorizado" },
      { status: 403 }
    );
  }

  const userId = getUserIdFromURL(req);
  if (!userId || !ObjectId.isValid(userId)) {
    return NextResponse.json(
      { success: false, error: "ID de usuario inválido" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const vehiclesCollection = db.collection("vehicles");

    const vehicles = await vehiclesCollection
      .find({ "sellerContact.userId": userId })
      .sort({ createdAt: -1 })
      .project({
        _id: 1,
        brand: 1,
        brandOther: 1,
        model: 1,
        modelOther: 1,
        year: 1,
        price: 1,
        currency: 1,
        status: 1,
        images: 1,
        location: 1,
        mileage: 1,
        condition: 1,
        createdAt: 1,
        postedDate: 1,
        views: 1,
      })
      .toArray();

    const formatted = vehicles.map((v) => ({
      _id: v._id.toString(),
      brand: v.brandOther || v.brand,
      model: v.modelOther || v.model,
      year: v.year,
      price: v.price,
      currency: v.currency || "USD",
      status: v.status,
      image: v.images?.[0] || null,
      location: v.location,
      mileage: v.mileage,
      condition: v.condition,
      views: v.views || 0,
      createdAt: (v.createdAt || v.postedDate)?.toISOString?.() ?? null,
    }));

    return NextResponse.json({ success: true, data: formatted, total: formatted.length });
  } catch (error) {
    console.error("Error fetching user vehicles (admin):", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}