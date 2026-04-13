// src/app/api/admin/vehicles/route.ts
import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { ApiResponseBackend } from "@/types/types";
import type { WithId, Document, Filter } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

// ── Helpers ───────────────────────────────────────────────────────────────────
const createErrorResponse = (error: string): ApiResponseBackend<null> => ({
  success: false,
  error,
});

const createSuccessResponse = <T>(data: T, message?: string): ApiResponseBackend<T> => ({
  success: true,
  data,
  message,
});

const toISOSafe = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return undefined;
};

const convertDoc = (doc: WithId<Document>) => ({
  _id: doc._id.toString(),
  category: doc.category,
  subcategory: doc.subcategory,
  brand: doc.brand,
  brandOther: doc.brandOther,
  model: doc.model,
  year: doc.year,
  price: doc.price,
  currency: doc.currency,
  isNegotiable: doc.isNegotiable,
  mileage: doc.mileage,
  color: doc.color,
  engine: doc.engine,
  displacement: doc.displacement,
  transmission: doc.transmission,
  condition: doc.condition,
  location: doc.location,
  features: doc.features || [],
  fuelType: doc.fuelType,
  doors: doc.doors,
  seats: doc.seats,
  weight: doc.weight,
  driveType: doc.driveType,
  loadCapacity: doc.loadCapacity,
  sellerContact: doc.sellerContact,
  warranty: doc.warranty,
  description: doc.description,
  images: doc.images || [],
  documentation: doc.documentation || [],
  vin: doc.vin,
  referenceNumber: doc.referenceNumber,
  paymentProof: doc.paymentProof,
  status: doc.status,
  views: doc.views,
  isFeatured: doc.isFeatured,
  rejectionReason: doc.rejectionReason,
  postedDate: toISOSafe(doc.postedDate),
  createdAt: toISOSafe(doc.createdAt),
  updatedAt: toISOSafe(doc.updatedAt),
});

type SortField = "createdAt" | "price" | "views";
type SortOrder = 1 | -1;

const SORT_MAP: Record<string, [SortField, SortOrder]> = {
  newest:      ["createdAt", -1],
  oldest:      ["createdAt",  1],
  "price-low": ["price",      1],
  "price-high":["price",     -1],
  views:       ["views",     -1],
};

// ── GET /api/admin/vehicles ───────────────────────────────────────────────────
// Query params:
//   page       (default 1)
//   limit      (default 10, max 100)
//   status     ("all" | "pending" | "approved" | "rejected" | "archived")
//   search     (brand, model, location, sellerContact.name)
//   sortBy     ("newest" | "oldest" | "price-low" | "price-high" | "views")
//   category   (comma-separated: "car,motorcycle")
//   priceMin   (number)
//   priceMax   (number)
//   featured   ("true" | "false")
//   dateFrom   (ISO string)
//   dateTo     (ISO string)
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(createErrorResponse("Acceso no autorizado"), { status: 403 });
    }

    const { searchParams } = req.nextUrl;

    // Pagination
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1",  10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    // Filters
    const status    = searchParams.get("status")   || "all";
    const search    = searchParams.get("search")?.trim() || "";
    const sortBy    = searchParams.get("sortBy")   || "newest";
    const categoryParam = searchParams.get("category") || "";
    const priceMin  = parseFloat(searchParams.get("priceMin") || "0");
    const priceMax  = parseFloat(searchParams.get("priceMax") || "0");
    const featured  = searchParams.get("featured"); // "true" | "false" | null
    const dateFrom  = searchParams.get("dateFrom");
    const dateTo    = searchParams.get("dateTo");

    // ── Build filter ──────────────────────────────────────────────────────────
    const filter: Filter<Document> = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { brand:                { $regex: search, $options: "i" } },
        { model:                { $regex: search, $options: "i" } },
        { location:             { $regex: search, $options: "i" } },
        { "sellerContact.name": { $regex: search, $options: "i" } },
      ];
    }

    // Category — puede ser uno o varios separados por coma
    if (categoryParam) {
      const categories = categoryParam.split(",").map((c) => c.trim()).filter(Boolean);
      if (categories.length === 1) {
        filter.category = categories[0];
      } else if (categories.length > 1) {
        filter.category = { $in: categories };
      }
    }

    // Price range — solo aplica si al menos uno de los dos tiene valor
    if (priceMin > 0 || priceMax > 0) {
      filter.price = {
        ...(priceMin > 0 ? { $gte: priceMin } : {}),
        ...(priceMax > 0 ? { $lte: priceMax } : {}),
      };
    }

    // Featured
    if (featured === "true")  filter.isFeatured = true;
    if (featured === "false") filter.isFeatured = { $ne: true };

    // Date range
    if (dateFrom || dateTo) {
      filter.createdAt = {
        ...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
        ...(dateTo   ? { $lte: new Date(dateTo)   } : {}),
      };
    }

    // ── Sort ──────────────────────────────────────────────────────────────────
    const [sortField, sortOrder] = SORT_MAP[sortBy] ?? SORT_MAP.newest;

    // ── Query ─────────────────────────────────────────────────────────────────
    const client = await clientPromise;
    const collection = client.db("vehicle_store").collection("vehicles");

    const [total, docs] = await Promise.all([
      collection.countDocuments(filter),
      collection
        .find(filter)
        .sort({ [sortField]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
    ]);

    return NextResponse.json(
      createSuccessResponse({
        vehicles: docs.map(convertDoc),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      createErrorResponse(`Error interno del servidor: ${message}`),
      { status: 500 }
    );
  }
}