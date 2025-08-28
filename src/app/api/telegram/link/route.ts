// src/app/api/telegram/link/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { randomBytes } from 'crypto';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');
    const usersCollection = db.collection('users');

    // 1. Generar un token seguro y una fecha de expiración (ej. 10 minutos)
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos desde ahora

    // 2. Guardar el token en el documento del usuario
    await usersCollection.updateOne(
      { _id: new (await import('mongodb')).ObjectId(session.user.id) },
      { $set: { telegramLinkToken: token, telegramLinkTokenExpires: expires } }
    );

    // 3. Construir el enlace de Telegram (deep link)
    const botUsername = process.env.TELEGRAM_BOT_USERNAME;
    if (!botUsername) {
      throw new Error('TELEGRAM_BOT_USERNAME no está configurado');
    }
    const link = `https://t.me/${botUsername}?start=${token}`;

    return NextResponse.json({ success: true, link });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error generando enlace de Telegram:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
