// scripts/create-indexes.ts
// Ejecutar UNA SOLA VEZ: npx tsx scripts/create-indexes.ts
// Crea todos los índices necesarios basados en las consultas reales del proyecto

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI!;
if (!uri) {
  console.error("❌ MONGODB_URI no encontrado en .env.local");
  process.exit(1);
}

async function createIndexes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB\n");

    const db = client.db("vehicle_store");

    // ─────────────────────────────────────────
    // COLECCIÓN: vehicles
    // ─────────────────────────────────────────
    const vehicles = db.collection("vehicles");

    console.log("📦 Creando índices en colección 'vehicles'...");

    // 1. El más importante: filtrar por status (usado en TODAS las consultas públicas)
    await vehicles.createIndex(
      { status: 1 },
      { name: "idx_status", background: true }
    );
    console.log("  ✓ idx_status");

    // 2. Listado principal: status + fecha (vehicleList, getApprovedVehicles)
    await vehicles.createIndex(
      { status: 1, createdAt: -1 },
      { name: "idx_status_createdAt", background: true }
    );
    console.log("  ✓ idx_status_createdAt");

    // 3. Búsqueda por texto (searchBar en vehicleList)
    await vehicles.createIndex(
      { brand: "text", model: "text", description: "text", location: "text" },
      { name: "idx_text_search", background: true }
    );
    console.log("  ✓ idx_text_search");

    // 4. Filtros más usados en vehicleList
    await vehicles.createIndex(
      { status: 1, category: 1, price: 1 },
      { name: "idx_status_category_price", background: true }
    );
    console.log("  ✓ idx_status_category_price");

    // 5. Filtros de año y kilometraje
    await vehicles.createIndex(
      { status: 1, year: -1, mileage: 1 },
      { name: "idx_status_year_mileage", background: true }
    );
    console.log("  ✓ idx_status_year_mileage");

    // 6. Vehículos similares (findSimilarVehicles usa category + status)
    await vehicles.createIndex(
      { status: 1, category: 1, brand: 1 },
      { name: "idx_status_category_brand", background: true }
    );
    console.log("  ✓ idx_status_category_brand");

    // 7. Vehículos destacados (isFeatured)
    await vehicles.createIndex(
      { status: 1, isFeatured: 1 },
      { name: "idx_status_featured", background: true }
    );
    console.log("  ✓ idx_status_featured");

    // 8. Market price (busca por brand + model + year)
    await vehicles.createIndex(
      { brand: 1, model: 1, year: 1 },
      { name: "idx_brand_model_year", background: true }
    );
    console.log("  ✓ idx_brand_model_year");

    // 9. Contador de vistas (views frecuentemente incrementado)
    await vehicles.createIndex(
      { status: 1, views: -1 },
      { name: "idx_status_views", background: true }
    );
    console.log("  ✓ idx_status_views");

    // ─────────────────────────────────────────
    // COLECCIÓN: users
    // ─────────────────────────────────────────
    const users = db.collection("users");

    console.log("\n👤 Creando índices en colección 'users'...");

    // Email es el campo más buscado (login, registro, forgot-password)
    await users.createIndex(
      { email: 1 },
      { name: "idx_email", unique: true, background: true }
    );
    console.log("  ✓ idx_email (unique)");

    await users.createIndex(
      { createdAt: -1 },
      { name: "idx_createdAt", background: true }
    );
    console.log("  ✓ idx_createdAt");

    // ─────────────────────────────────────────
    // COLECCIÓN: favorites
    // ─────────────────────────────────────────
    const favorites = db.collection("favorites");

    console.log("\n❤️  Creando índices en colección 'favorites'...");

    // Buscar favoritos de un usuario específico
    await favorites.createIndex(
      { userId: 1 },
      { name: "idx_userId", background: true }
    );
    console.log("  ✓ idx_userId");

    // Verificar si ya existe un favorito (findOne con userId + vehicleId)
    await favorites.createIndex(
      { userId: 1, vehicleId: 1 },
      { name: "idx_userId_vehicleId", unique: true, background: true }
    );
    console.log("  ✓ idx_userId_vehicleId (unique)");

    // ─────────────────────────────────────────
    // COLECCIÓN: ratings
    // ─────────────────────────────────────────
    const ratings = db.collection("ratings");

    console.log("\n⭐ Creando índices en colección 'ratings'...");

    await ratings.createIndex(
      { vehicleId: 1 },
      { name: "idx_vehicleId", background: true }
    );
    console.log("  ✓ idx_vehicleId");

    await ratings.createIndex(
      { vehicleId: 1, userId: 1 },
      { name: "idx_vehicleId_userId", unique: true, background: true }
    );
    console.log("  ✓ idx_vehicleId_userId (unique)");

    // ─────────────────────────────────────────
    // RESUMEN
    // ─────────────────────────────────────────
    console.log("\n─────────────────────────────────────────");
    console.log("✅ Todos los índices creados exitosamente");
    console.log("─────────────────────────────────────────");

    // Mostrar índices creados por colección
    const collections = ["vehicles", "users", "favorites", "ratings"];
    for (const col of collections) {
      const indexes = await db.collection(col).indexes();
      console.log(`\n📋 ${col}: ${indexes.length} índices`);
      indexes.forEach(idx => console.log(`   - ${idx.name}`));
    }

  } catch (error) {
    console.error("❌ Error creando índices:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Conexión cerrada");
  }
}

createIndexes();