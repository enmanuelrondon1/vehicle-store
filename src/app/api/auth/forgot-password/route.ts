// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendPasswordResetEmail } from "@/lib/mailer";
import crypto from "crypto";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try { 
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "El email es requerido" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    const users = db.collection("users");

    const user = await users.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Por seguridad, no revelamos si el usuario existe o no
      logger.warn(`Intento de reseteo para email no registrado: ${email}`);
      return NextResponse.json(
        {
          message:
            "Si tu email está registrado, recibirás un correo con instrucciones.",
        },
        { status: 200 }
      );
    }

    // Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora de expiración

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: passwordResetToken,
          resetPasswordExpires: passwordResetExpires,
          updatedAt: new Date(),
        },
      }
    );

    // Enviar correo
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json(
      {
        message:
          "Si tu email está registrado, recibirás un correo con instrucciones.",
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error en la solicitud de reseteo de contraseña:", error);
    return NextResponse.json(
      { error: "Ocurrió un error en el servidor." },
      { status: 500 }
    );
  }
}
