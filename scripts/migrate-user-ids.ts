//scripts/migrate-user-ids.ts
import { MongoClient, ObjectId } from 'mongodb';

// Extraído de tu archivo .env.local
const MONGODB_URI = "mongodb+srv://designdevproenmanuel:Admin123*@cluster0.su62xsn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = 'vehicle_store';
const COLLECTION_NAME = 'vehicles';

async function migrateUserIds() {
  console.log('Iniciando script de migración...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Conectado a la base de datos MongoDB.');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // 1. Buscar documentos donde 'sellerContact.userId' es un ObjectId
    const query = { 'sellerContact.userId': { $type: 'objectId' } };
    const documentsToUpdate = await collection.find(query).toArray();

    if (documentsToUpdate.length === 0) {
      console.log('No se encontraron anuncios con el formato de ID antiguo. ¡No se necesita migración!');
      return;
    }

    console.log(`Se encontraron ${documentsToUpdate.length} anuncios para actualizar.`);

    // 2. Crear las operaciones de actualización en un bulk
    const bulkOps = documentsToUpdate.map(doc => {
      const newUserId = (doc.sellerContact.userId as ObjectId).toHexString();
      console.log(`- Actualizando anuncio ${doc._id}: ID de usuario ${doc.sellerContact.userId} -> ${newUserId}`);
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { 'sellerContact.userId': newUserId } }
        }
      };
    });

    // 3. Ejecutar las operaciones
    const result = await collection.bulkWrite(bulkOps);

    console.log('\n¡Migración completada con éxito!');
    console.log(`- Documentos buscados: ${result.matchedCount}`);
    console.log(`- Documentos actualizados: ${result.modifiedCount}`);

  } catch (error) {
    console.error('Ocurrió un error durante la migración:', error);
  } finally {
    await client.close();
    console.log('Conexión con la base de datos cerrada.');
  }
}

migrateUserIds();