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
  password?: string; // Hacemos la contraseña opcional para no devolverla
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud
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
    const existingUser = await users.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Ya existe un usuario con este email" 
        },
        { status: 409 }
      );
    }

    // Encriptar la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario para la DB
    const newUser: UserDocument = {
      name: toTitleCase(name.trim()), // Normalizar el nombre
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user", // Rol por defecto
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertar el usuario en la base de datos
    const result = await users.insertOne(newUser);

    if (!result.insertedId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Error al crear el usuario" 
        },
        { status: 500 }
      );
    }

    // 📧 Enviar correo de bienvenida
    // Se ejecutan en paralelo para no retrasar la respuesta al usuario.
    try {
      await Promise.all([
        sendWelcomeEmail(newUser.email, newUser.name),
        sendAdminNewUserNotification(newUser.email, newUser.name)
      ]);
      logger.info(`Correo de bienvenida enviado a ${newUser.email}`);
    } catch (emailError) {
      logger.error('Fallo el envío del correo de bienvenida, pero el usuario fue creado:', emailError);
    }

    // Respuesta exitosa (no incluimos la contraseña)
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
    
    // Manejar errores específicos de MongoDB
    if (error instanceof Error) {
      // Error de conexión a la base de datos
      if (error.message.includes('MongoNetworkError')) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Error de conexión a la base de datos" 
          },
          { status: 503 }
        );
      }
      
      // Error de duplicado (por si acaso)
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Ya existe un usuario con este email" 
          },
          { status: 409 }
        );
      }
    }

    // Error genérico
    return NextResponse.json(
      { 
        success: false, 
        error: "Error interno del servidor" 
      },
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