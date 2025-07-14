// scripts/migrate-pdf-urls.ts
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';

async function migratePdfUrls() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('your-database-name'); // Reemplaza con tu nombre de DB
    const collection = db.collection('vehicles');
    
    // Buscar todos los documentos que tengan paymentProof con /image/upload/
    const documentsToUpdate = await collection.find({
      paymentProof: { $regex: '/image/upload/.*\\.pdf' }
    }).toArray();
    
    console.log(`Encontrados ${documentsToUpdate.length} documentos para migrar`);
    
    for (const doc of documentsToUpdate) {
      const oldUrl = doc.paymentProof;
      const newUrl = oldUrl.replace('/image/upload/', '/raw/upload/');
      
      await collection.updateOne(
        { _id: doc._id },
        { $set: { paymentProof: newUrl } }
      );
      
      console.log(`Migrado: ${oldUrl} -> ${newUrl}`);
    }
    
    console.log('Migración completada');
    
  } catch (error) {
    console.error('Error en la migración:', error);
  } finally {
    await client.close();
  }
}

migratePdfUrls();