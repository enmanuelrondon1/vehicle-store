// src/lib/cloudinary.ts - Configuración corregida para PDFs
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir archivos (imágenes y PDFs)
export const uploadFile = async (file: File, folder: string) => {
  try {
    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Determinar si es PDF
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    return new Promise((resolve, reject) => {
      // Definir las opciones con tipos específicos
      const uploadOptions: UploadApiOptions = {
        folder: folder,
        resource_type: isPDF ? 'raw' : 'auto',
        public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        ...(isPDF && {
          // Opciones específicas para PDFs
          format: 'pdf',
          access_mode: 'public', // Importante para acceso público
        })
      };

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            reject(error);
          } else {
            console.log('Upload successful:', result);
            resolve(result);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Error processing file:', error);
    throw error;
  }
};

// Función CORREGIDA para obtener la URL correcta según el tipo de archivo
export const getCloudinaryUrl = (publicId: string, resourceType: 'image' | 'raw' = 'image') => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  if (resourceType === 'raw') {
    // Para PDFs y otros archivos raw
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  } else {
    // Para imágenes
    return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  }
};

// Función para convertir URLs existentes de image/upload a raw/upload
export const convertToRawUrl = (cloudinaryUrl: string): string => {
  if (cloudinaryUrl.includes('/image/upload/') && cloudinaryUrl.endsWith('.pdf')) {
    return cloudinaryUrl.replace('/image/upload/', '/raw/upload/');
  }
  return cloudinaryUrl;
};

// Función para extraer public_id de una URL completa
export const extractPublicId = (cloudinaryUrl: string): string => {
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    
    // Encontrar el índice después de 'upload'
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return '';
    
    // Todo después de 'upload' es el public_id (incluyendo carpetas)
    const publicIdParts = pathParts.slice(uploadIndex + 1);
    
    // Si hay version (v1234567890), omitirla
    if (publicIdParts[0] && publicIdParts[0].startsWith('v')) {
      publicIdParts.shift();
    }
    
    return publicIdParts.join('/');
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return '';
  }
};

// Función para eliminar archivos
export const deleteFile = async (publicId: string, resourceType: 'image' | 'raw' = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export default cloudinary;