// src/app/api/admin/users/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Extrae el ID de usuario de la URL de la petición.
 * Ejemplo: de /api/admin/users/12345, extrae "12345".
 */
function getUserIdFromURL(req: NextRequest): string | null {
    const pathParts = req.nextUrl.pathname.split('/');
    // La URL esperada es /api/admin/users/[id]
    // El split resulta en: ["", "api", "admin", "users", "el-id"]
    if (pathParts.length === 5) {
        return pathParts[4]; // Devuelve la última parte, que es el ID
    }
    return null;
}

/**
 * Manejador para la solicitud PUT: Actualiza el rol de un usuario.
 * NOTA: No usamos el parámetro 'context' para evitar un error de tipos del entorno.
 */
export async function PUT(req: NextRequest) {
  // 1. Verificación de sesión y rol de administrador
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: "Acceso no autorizado" }, { status: 403 });
  }

  // 2. Extraer y validar el ID del usuario desde la URL
  const id = getUserIdFromURL(req);
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "ID de usuario inválido o no encontrado en la URL" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { role } = body;

    // 3. Validar el rol proporcionado
    if (role !== 'admin' && role !== 'user') {
      return NextResponse.json({ success: false, error: "Rol especificado inválido" }, { status: 400 });
    }

    // 4. Actualizar el usuario en la base de datos
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role: role } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Rol de usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el rol del usuario:", error);
    return NextResponse.json({ success: false, error: "Error Interno del Servidor" }, { status: 500 });
  }
}

/**
 * Manejador para la solicitud DELETE: Elimina un usuario.
 */
export async function DELETE(req: NextRequest) {
  // 1. Verificación de sesión y rol de administrador
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, error: "Acceso no autorizado" }, { status: 403 });
  }

  // 2. Extraer y validar el ID del usuario desde la URL
  const id = getUserIdFromURL(req);
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "ID de usuario inválido o no encontrado en la URL" }, { status: 400 });
  }

  try {
    // 3. Eliminar el usuario y sus datos asociados
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const usersCollection = db.collection("users");
    const vehiclesCollection = db.collection("vehicles");

    const userIdString = id;

    // Eliminar todos los vehículos asociados al usuario, buscando en el campo anidado
    await vehiclesCollection.deleteMany({ "sellerContact.userId": userIdString });

    // Ahora, eliminar al usuario
    const result = await usersCollection.deleteOne({ _id: new ObjectId(userIdString) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    return NextResponse.json({ success: false, error: "Error Interno del Servidor" }, { status: 500 });
  }
}