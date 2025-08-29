// src/app/api/telegram/disconnect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

interface DisconnectResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<DisconnectResponse>> {
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
    
    // Buscar el usuario actual
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

    // Verificar si el usuario tiene Telegram conectado
    if (!user.telegramUserId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No hay cuenta de Telegram vinculada' 
        },
        { status: 400 }
      );
    }

    // Remover información de Telegram del usuario
    const updateResult = await db.collection('users').updateOne(
      { email: session.user.email },
      {
        $unset: {
          telegramUserId: "",
          telegramUsername: "",
          telegramLinkedAt: ""
        },
        $set: {
          telegramDisconnectedAt: new Date()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No se pudo actualizar la información del usuario' 
        },
        { status: 500 }
      );
    }

    // Opcional: También puedes limpiar cualquier registro relacionado
    // Por ejemplo, si tienes una colección de notificaciones pendientes
    try {
      await db.collection('telegramNotifications').deleteMany({
        userId: user._id.toString()
      });
    } catch (cleanupError) {
      // Log del error pero no falla la operación principal
      console.warn('Error cleaning up Telegram notifications:', cleanupError);
    }

    // Log de la desconexión para auditoría
    try {
      await db.collection('telegramAuditLog').insertOne({
        userId: user._id.toString(),
        userEmail: session.user.email,
        action: 'DISCONNECT',
        telegramUserId: user.telegramUserId,
        telegramUsername: user.telegramUsername,
        timestamp: new Date(),
        ip: request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown'
      });
    } catch (auditError) {
      console.warn('Error logging Telegram disconnect:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: 'Cuenta de Telegram desvinculada exitosamente'
    });

  } catch (error) {
    console.error('Error disconnecting Telegram:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar estado de desconexión (opcional)
// Opción 1: Remover el parámetro completamente
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Método no permitido. Use POST para desconectar.' 
    },
    { status: 405 }
  );
}

// Opción 2 (alternativa): Usar underscore para indicar que no se usa
// export async function GET(_request: NextRequest): Promise<NextResponse> {
//   return NextResponse.json(
//     { 
//       success: false, 
//       error: 'Método no permitido. Use POST para desconectar.' 
//     },
//     { status: 405 }
//   );
// }