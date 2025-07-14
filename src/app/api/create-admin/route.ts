import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await usersCollection.insertOne({
      email,
      password: hashedPassword,
      role: "admin",
      name: "Admin User",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Usuario admin creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando usuario admin:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}