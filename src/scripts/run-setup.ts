import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
console.log('MONGODB_URI loaded:', !!process.env.MONGODB_URI);

import('./setup-telegram-bot').catch(console.error);
