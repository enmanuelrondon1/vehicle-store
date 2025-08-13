// src/app/api/cloudinary/sign/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Con NEXT_PUBLIC_
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,       // Con NEXT_PUBLIC_
  api_secret: process.env.CLOUDINARY_API_SECRET,             // Sin NEXT_PUBLIC_ (correcto)
});

export async function POST() {
  try {
    // El timestamp se genera en el backend para mayor seguridad y consistencia.
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp: timestamp,
      folder: 'vehicles' // Opcional: define una carpeta por defecto para la firma
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({ 
      signature, 
      timestamp,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY // Agregar la API key aquí
    });

  } catch (error) {
    console.error('Error signing Cloudinary request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}