// src/app/api/telegram/link/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';
import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb'; // Importar directamente

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    console.log("Session user: null or unauthorized");
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  console.log("Session user:", {
    id: session.user.id,
    email: session.user.email
  });

  try {
    const client = await clientPromise;
    const db = client.db('vehicle_store');
    const usersCollection = db.collection('users');

    // Verificar si ya tiene Telegram vinculado (opcional pero recomendado)
    const user = await usersCollection.findOne({ 
      _id: new ObjectId(session.user.id) 
    });
    
    if (user?.telegramUserId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tu cuenta ya está vinculada con Telegram' 
      }, { status: 400 });
    }

    // 1. Generar un token seguro y una fecha de expiración (ej. 15 minutos)
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos desde ahora

    // 2. Guardar el token en el documento del usuario
    await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
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