import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);

// Obtener argumentos de línea de comandos
const chatId = process.argv[2];
console.log('Chat ID recibido:', chatId);

import('./test-telegram-bot').then(async (module) => {
  await module.testTelegramBot(chatId);
}).catch(console.error);
