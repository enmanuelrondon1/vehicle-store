// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { withAdminAuth } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function handler() {
  try {
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const usersCollection = db.collection("users");

    // Obtenemos todos los usuarios
    const users = await usersCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Mapeamos los datos para devolver solo lo que necesitamos en el frontend
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      fullName: user.name || "N/A",
      email: user.email || "No email",
      provider: user.provider || 'credentials', // Añadimos el proveedor
      createdAt: user.createdAt || (user._id as ObjectId).getTimestamp(),
      lastSignInAt: user.lastSignInAt || null, // Asumiendo que este campo puede existir
      role: user.role || 'user',
      vehicleCount: user.vehicleCount || 0, // Asumiendo que este campo puede existir
    }));

    return NextResponse.json({ success: true, data: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Envolvemos el handler con el HOC de autenticación de administrador
export const GET = withAdminAuth(handler);