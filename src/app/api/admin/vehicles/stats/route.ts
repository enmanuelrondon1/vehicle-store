import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { ApiResponseBackend } from "@/types/types";

// Define the expected structure for the stats object
interface VehicleStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  sold: number;
  featured: number;
}

// Helper to create a standardized error response
const createErrorResponse = (error: string): ApiResponseBackend<null> => ({
  success: false,
  error,
});

// Helper to create a standardized success response
const createSuccessResponse = <T>(data: T): ApiResponseBackend<T> => ({
  success: true,
  data,
});

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), {
        status: 403,
      });
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const collection = db.collection("vehicles");

    // Use MongoDB's aggregation pipeline for efficiency
    const statusPipeline = [
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const statusCounts = await collection.aggregate(statusPipeline).toArray();

    const totalVehicles = await collection.countDocuments();
    const featuredVehicles = await collection.countDocuments({ isFeatured: true });


    // Initialize stats with default values
    const stats: VehicleStats = {
      total: totalVehicles,
      pending: 0,
      approved: 0,
      rejected: 0,
      sold: 0,
      featured: featuredVehicles,
    };

    // Populate stats from the aggregation result
    statusCounts.forEach((status) => {
      if (status._id === "pending") stats.pending = status.count;
      if (status._id === "approved") stats.approved = status.count;
      if (status._id === "rejected") stats.rejected = status.count;
      if (status._id === "sold") stats.sold = status.count;
    });

    return NextResponse.json(createSuccessResponse(stats), { status: 200 });

  } catch (error) {
    console.error("Error fetching vehicle stats:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${errorMessage}`),
      { status: 500 }
    );
  }
}