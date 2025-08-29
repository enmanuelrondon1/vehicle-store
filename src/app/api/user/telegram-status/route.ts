// src/app/api/user/telegram-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

interface TelegramStatusResponse {
  success: boolean;
  data?: {
    telegramUserId?: string;
    telegramUsername?: string;
  };
  error?: string;
}

// Función GET sin el parámetro request ya que no se usa
export async function GET(): Promise<NextResponse<TelegramStatusResponse>> {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autenticado' 
        },
        { status: 401 }
      );
    }

    // Conectar a la base de datos
    const client = await clientPromise;
    const db = client.db("vehicle_store");
    
    // Buscar el usuario en la base de datos
    const user = await db.collection('users').findOne({
      email: session.user.email
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    // Retornar información de Telegram del usuario
    return NextResponse.json({
      success: true,
      data: {
        telegramUserId: user.telegramUserId || undefined,
        telegramUsername: user.telegramUsername || undefined
      }
    });

  } catch (error) {
    console.error('Error fetching Telegram status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Método POST para actualizar el estado de Telegram (opcional)
export async function POST(request: NextRequest): Promise<NextResponse<TelegramStatusResponse>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No autenticado' 
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { telegramUserId, telegramUsername } = body;

    const client = await clientPromise;
    const db = client.db("vehicle_store");
    
    // Actualizar información de Telegram del usuario
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      {
        $set: {
          telegramUserId: telegramUserId || null,
          telegramUsername: telegramUsername || null,
          telegramLinkedAt: telegramUserId ? new Date() : null
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        telegramUserId: telegramUserId || undefined,
        telegramUsername: telegramUsername || undefined
      }
    });

  } catch (error) {
    console.error('Error updating Telegram status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}