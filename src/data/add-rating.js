import fs from 'fs/promises'; // Use the promises API for modern async/await
import vehiclesData from './vehicles.json' assert { type: 'json' }; // Import JSON with assertion

// Añade la propiedad 'rating' a cada vehículo con un valor aleatorio entre 0 y 5
vehiclesData.items.forEach(vehicle => {
  vehicle.rating = Number((Math.random() * 5).toFixed(1)); // Genera un número aleatorio con 1 decimal (ej. 3.7)
});

// Guarda el archivo JSON actualizado
await fs.writeFile('./vehicles.json', JSON.stringify(vehiclesData, null, 2), 'utf8');
console.log('Ratings añadidos exitosamente al archivo vehicles.json!');