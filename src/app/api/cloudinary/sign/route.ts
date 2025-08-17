// src/app/api/cloudinary/sign/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // ✅ Público (correcto)
  api_key: process.env.CLOUDINARY_API_KEY,                   // ✅ Privado (SIN NEXT_PUBLIC_)
  api_secret: process.env.CLOUDINARY_API_SECRET,             // ✅ Privado (correcto)
});

export async function POST() {
  try {
    // Validar que todas las variables estén presentes
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.error('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está configurado');
      return NextResponse.json({ error: 'Cloud name not configured' }, { status: 500 });
    }

    if (!process.env.CLOUDINARY_API_KEY) {
      console.error('❌ CLOUDINARY_API_KEY no está configurado');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ CLOUDINARY_API_SECRET no está configurado');
      return NextResponse.json({ error: 'API secret not configured' }, { status: 500 });
    }

    // El timestamp se genera en el backend para mayor seguridad y consistencia.
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'vehicles' // Opcional: define una carpeta por defecto para la firma
    };

    console.log('🔐 Generando firma para Cloudinary...');
    
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    const responseData = { 
      signature, 
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY // ✅ Ahora sin NEXT_PUBLIC_
    };

    console.log('✅ Firma generada exitosamente');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('💥 Error signing Cloudinary request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}