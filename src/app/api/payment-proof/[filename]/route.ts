// src/app/api/payment-proof/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Esperar a que se resuelva la promesa de params
    const { filename } = await params;
    console.log('Filename recibido:', filename);
    
    // Extraer el public_id del filename (sin extensión)
    const publicId = filename.replace(/\.[^/.]+$/, '');
    const fullPublicId = `vehicle-payment-proofs/${publicId}`;
    
    console.log('Public ID:', fullPublicId);
    
    // Determinar si es PDF basándose en la extensión
    const isPDF = filename.toLowerCase().endsWith('.pdf');
    console.log('Es PDF:', isPDF);
    
    try {
      // MÉTODO 1: Usar Cloudinary SDK para obtener la info del archivo
      const resourceType = isPDF ? 'raw' : 'image';
      const result = await cloudinary.api.resource(fullPublicId, {
        resource_type: resourceType
      });
      
      console.log('Recurso encontrado:', result.secure_url);
      
      // Hacer fetch del archivo usando la URL segura de Cloudinary
      const response = await fetch(result.secure_url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; VehicleStore/1.0)',
          'Accept': isPDF ? 'application/pdf,*/*' : 'image/*,*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Obtener el contenido del archivo
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determinar el tipo de contenido
      let contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // Asegurar el tipo correcto para PDFs
      if (isPDF && !contentType.includes('pdf')) {
        contentType = 'application/pdf';
      }

      console.log('✅ Enviando archivo con Content-Type:', contentType);

      // Retornar el archivo con headers apropiados
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          // Headers adicionales para PDFs
          ...(isPDF && {
            'X-Content-Type-Options': 'nosniff',
            'Accept-Ranges': 'bytes',
          })
        },
      });

    } catch (cloudinaryError) {
      console.log('❌ Error con Cloudinary SDK, probando método alternativo:', cloudinaryError);
      
      // MÉTODO 2: Probar URLs sin versión específica
      const urlsToTry = [];
      
      if (isPDF) {
        // Para PDFs, probar con raw resource type
        urlsToTry.push(
          `https://res.cloudinary.com/dcdawwvx2/raw/upload/vehicle-payment-proofs/${filename}`,
          `https://res.cloudinary.com/dcdawwvx2/image/upload/vehicle-payment-proofs/${filename}`,
          `https://res.cloudinary.com/dcdawwvx2/auto/upload/vehicle-payment-proofs/${filename}`
        );
      } else {
        // Para imágenes
        urlsToTry.push(
          `https://res.cloudinary.com/dcdawwvx2/image/upload/vehicle-payment-proofs/${filename}`,
          `https://res.cloudinary.com/dcdawwvx2/auto/upload/vehicle-payment-proofs/${filename}`
        );
      }

      let response;
      let workingUrl;
      
      // Probar cada URL hasta encontrar una que funcione
      for (const cloudinaryUrl of urlsToTry) {
        console.log('Probando URL:', cloudinaryUrl);
        
        try {
          response = await fetch(cloudinaryUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; VehicleStore/1.0)',
              'Accept': isPDF ? 'application/pdf,*/*' : 'image/*,*/*',
            },
          });

          if (response.ok) {
            workingUrl = cloudinaryUrl;
            console.log('✅ URL funcionando:', workingUrl);
            break;
          } else {
            console.log('❌ Falló URL:', cloudinaryUrl, 'Status:', response.status);
          }
        } catch (error) {
          console.log('❌ Error con URL:', cloudinaryUrl, error);
        }
      }

      if (!response || !response.ok) {
        console.error('❌ Ninguna URL funcionó para el archivo:', filename);
        return NextResponse.json({ 
          error: 'Archivo no encontrado',
          filename: filename,
          publicId: fullPublicId,
          testedUrls: urlsToTry
        }, { status: 404 });
      }

      // Obtener el contenido del archivo
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Determinar el tipo de contenido
      let contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      if (isPDF && !contentType.includes('pdf')) {
        contentType = 'application/pdf';
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=31536000',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
          ...(isPDF && {
            'X-Content-Type-Options': 'nosniff',
            'Accept-Ranges': 'bytes',
          })
        },
      });
    }

  } catch (error) {
    console.error('❌ Error en proxy de PDF:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Agregar OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}