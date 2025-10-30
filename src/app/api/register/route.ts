// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";
import { sendWelcomeEmail, sendAdminNewUserNotification } from "@/lib/mailer";
import { ObjectId } from "mongodb";
import { toTitleCase } from "@/lib/utils";
import { z } from "zod";

// Esquema de validación con Zod para mayor robustez y consistencia
const RegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("El formato del email no es válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

// Interfaz para el usuario en la base de datos
interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validar los datos usando Zod
    const validationResult = RegisterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Conectar a MongoDB
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const users = db.collection<UserDocument>("users");

    // Verificar si el usuario ya existe
    const existingUser = await users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Ya existe un usuario con este email" },
        { status: 409 }
      );
    }

    // Encriptar la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario para la DB
    const newUser: UserDocument = {
      name: toTitleCase(name.trim()),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      phone: "",
      location: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertar el usuario en la base de datos
    const result = await users.insertOne(newUser);

    if (!result.insertedId) {
      return NextResponse.json(
        { success: false, error: "Error al crear el usuario" },
        { status: 500 }
      );
    }

    // 📧 Enviar correos de bienvenida y notificación
    try {
      await Promise.all([
        sendWelcomeEmail(newUser.email, newUser.name),
        sendAdminNewUserNotification(newUser.email, newUser.name)
      ]);
      logger.info(`Correos de registro enviados a ${newUser.email}`);
    } catch (emailError) {
      logger.error('Fallo el envío de correos, pero el usuario fue creado:', emailError);
    }

    // Respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: "¡Registro exitoso! Revisa tu correo para darte la bienvenida.",
        user: {
          id: result.insertedId.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    logger.error("Error en el registro:", error);

    if (error instanceof Error) {
      if (error.message.includes('MongoNetworkError')) {
        return NextResponse.json(
          { success: false, error: "Error de conexión a la base de datos" },
          { status: 503 }
        );
      }
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { success: false, error: "Ya existe un usuario con este email" },
          { status: 409 }
        );
      }
    }

    // Error genérico
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Método GET para verificar que el endpoint funciona
export async function GET() {
  return NextResponse.json(
    {
      message: "Endpoint de registro funcionando",
      methods: ["POST"]
    },
    { status: 200 }
  );
}