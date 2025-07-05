// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";

// Interfaz para los datos de registro
interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Interfaz para el usuario en la base de datos
interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Validar email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña
const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

// Validar nombre
const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export async function POST(request: NextRequest) {
  try {
    // Parsear el cuerpo de la solicitud
    const body: RegisterData = await request.json();
    const { name, email, password } = body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Todos los campos son requeridos" 
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "El formato del email no es válido" 
        },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (!validatePassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "La contraseña debe tener al menos 8 caracteres" 
        },
        { status: 400 }
      );
    }

    // Validar nombre
    if (!validateName(name)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "El nombre debe tener al menos 2 caracteres" 
        },
        { status: 400 }
      );
    }

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
          message: "Ya existe un usuario con este email" 
        },
        { status: 409 }
      );
    }

    // Encriptar la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el nuevo usuario
    const newUser: UserDocument = {
      name: name.trim(),
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
          message: "Error al crear el usuario" 
        },
        { status: 500 }
      );
    }

    // Respuesta exitosa (no incluimos la contraseña)
    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado exitosamente",
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
    console.error("Error en el registro:", error);
    
    // Manejar errores específicos de MongoDB
    if (error instanceof Error) {
      // Error de conexión a la base de datos
      if (error.message.includes('MongoNetworkError')) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Error de conexión a la base de datos" 
          },
          { status: 503 }
        );
      }
      
      // Error de duplicado (por si acaso)
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Ya existe un usuario con este email" 
          },
          { status: 409 }
        );
      }
    }

    // Error genérico
    return NextResponse.json(
      { 
        success: false, 
        message: "Error interno del servidor" 
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