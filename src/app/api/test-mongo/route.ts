import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_db"); // Cambia por tu nombre de base de datos
    const collection = db.collection("test_collection");
    await collection.insertOne({
      test: "Hello from MongoDB",
      timestamp: new Date(),
    });
    const result = await collection.find({}).toArray();
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    // Tipar error como unknown y manejarlo explícitamente
    console.error("Error connecting to MongoDB:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
