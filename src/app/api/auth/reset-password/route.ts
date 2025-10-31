// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const client = await clientPromise;
    const db = client.db('vehicle_store');
    const users = db.collection('users');

    const user = await users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'El token es inválido o ha expirado' }, { status: 400 });
    }

    // Hashear la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Actualizar contraseña y limpiar token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        },
      }
    );

    logger.info(`Contraseña restablecida exitosamente para el usuario: ${user.email}`);

    return NextResponse.json({ message: 'Tu contraseña ha sido restablecida exitosamente.' }, { status: 200 });

  } catch (error) {
    logger.error('Error al restablecer la contraseña:', error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}