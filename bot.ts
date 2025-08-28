// Scripts recomendados para package.json:
/*
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "bot": "tsx bot.ts",
  "bot:dev": "tsx --watch bot.ts"
}
*/

// bot.ts
// Cargar variables de entorno PRIMERO
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Después cargar las demás dependencias
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

// ¡Usa tu NUEVO token aquí! Guárdalo de forma segura, por ejemplo, en una variable de entorno.
// NUNCA lo dejes visible en tu código si lo vas a subir a un repositorio público.
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // <-- ¡REEMPLAZA ESTO CON TU NUEVO TOKEN!

if (!BOT_TOKEN) {
  console.error(
    "Error: TELEGRAM_BOT_TOKEN no está configurado en las variables de entorno."
  );
  console.log("Token encontrado:", BOT_TOKEN); // Para debug
  process.exit(1); // Termina el proceso si el token no está presente
}

// Crea una instancia de tu bot
const bot = new Telegraf(BOT_TOKEN);

// Cuando un usuario envíe el comando /start, el bot responderá.
bot.start((ctx) => {
  // ctx (context) contiene toda la información del mensaje, chat, usuario, etc.
  // Para los comandos /start y /help, 'ctx.chat' siempre estará definido.
  console.log("Me han iniciado en el chat:", ctx.chat.id);
  ctx.reply("¡Hola! Soy Automarket Bot. ¿En qué puedo ayudarte?");
});

// Cuando un usuario envíe el comando /help
bot.help((ctx) => {
  ctx.reply("Estos son los comandos disponibles:\n/start - Iniciar el bot\n/help - Mostrar esta ayuda");
});

// Responde a cualquier mensaje de texto
bot.on(message("text"), (ctx) => {
  // Al usar `bot.on(message("text"), ...)` TypeScript sabe que `ctx.message`
  // es un mensaje de texto y por lo tanto `ctx.message.text` existe y es seguro.
  const textoRecibido = ctx.message.text;
  console.log(`He recibido el texto: "${textoRecibido}"`);
  ctx.reply(`Has dicho: "${textoRecibido}"`);
});

// Inicia el bot para que empiece a escuchar mensajes
bot.launch();
console.log("El bot está en funcionamiento...");

// Permite que el bot se detenga de forma elegante (Ctrl+C en la terminal)
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));