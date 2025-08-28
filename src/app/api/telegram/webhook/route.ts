// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "@/lib/telegram-bot";
import clientPromise from "@/lib/mongodb";
import { Context } from "telegraf";

let bot: TelegramBot | null = null;

// Tipos para contexto de Telegram - SIMPLIFICADO
// Usamos directamente Context de Telegraf sin redefiniciones
// type TelegramContext = Context; // Si necesitas un alias

// Inicializar bot si no existe
function getBot() {
  if (!bot) {
    bot = new TelegramBot();
  }
  return bot;
}

// Manejar comando /start con token de vinculación
async function handleStartCommand(ctx: Context, startPayload?: string) {
  if (startPayload) {
    // Es una vinculación de cuenta
    try {
      const client = await clientPromise;
      const db = client.db("vehicle_store");
      const usersCollection = db.collection("users");

      // Buscar usuario por token
      const user = await usersCollection.findOne({
        telegramLinkToken: startPayload,
        telegramLinkTokenExpires: { $gt: new Date() },
      });

      if (user) {
        // Verificar que ctx.from existe antes de usarlo
        if (!ctx.from) {
          await ctx.reply("❌ Error: No se pudo obtener información del usuario.");
          return;
        }

        // Vincular cuenta
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $set: {
              telegramUserId: ctx.from.id.toString(),
              telegramUsername: ctx.from.username || null,
            },
            $unset: {
              telegramLinkToken: "",
              telegramLinkTokenExpires: "",
            },
          }
        );

        await ctx.reply(
          `🎉 ¡Cuenta vinculada exitosamente!

¡Hola ${user.name || "Usuario"}! Tu cuenta de AutoMarket ahora está conectada con Telegram.

🔔 **Notificaciones activadas:**
• Nuevos vehículos que coincidan con tus preferencias
• Actualizaciones de tus anuncios
• Cambios de precios en vehículos guardados

🌐 **Comandos disponibles:**
/help - Ver todos los comandos
/buscar - Buscar vehículos
/web - Visitar AutoMarket

¡Bienvenido a AutoMarket Bot! 🚗`,
          { parse_mode: "Markdown" }
        );
      } else {
        await ctx.reply(`❌ Token de vinculación inválido o expirado.

Por favor, genera un nuevo enlace desde tu perfil en:
🌐 https://1auto.market

¿Necesitas ayuda? Usa el comando /contacto`);
      }
    } catch (error) {
      console.error("Error vinculando cuenta:", error);
      await ctx.reply("❌ Error vinculando cuenta. Intenta nuevamente.");
    }
  } else {
    // Comando /start normal
    const welcomeMessage = `
🚗 **¡Bienvenido a AutoMarket Bot!**

Soy tu asistente para encontrar el vehículo perfecto. Aquí puedes:

🔍 **Buscar vehículos** disponibles
📊 **Ver estadísticas** del mercado
🔔 **Recibir notificaciones** de nuevos vehículos
💬 **Contactar** con vendedores

**¡Escribe /help para ver todos los comandos disponibles!**

🌐 **Visita nuestra web:** https://1auto.market

¿Tienes una cuenta? Puedes vincularla desde tu perfil para recibir notificaciones personalizadas.
`;
    await ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
  }
}

// Configurar comandos del bot
function setupBotCommands() {
  const telegramBot = getBot();
  const botInstance = telegramBot.getBot();

  // Comando /start con soporte para vinculación
  botInstance.start(async (ctx) => {
    const startPayload = ctx.startPayload;
    await handleStartCommand(ctx, startPayload);
  });

  // Comando /help
  botInstance.help(async (ctx) => {
    const helpMessage = `
📋 **Comandos disponibles:**

/start - Iniciar el bot
/help - Mostrar esta ayuda
/buscar - Buscar vehículos
/notificaciones - Configurar alertas
/estadisticas - Ver estadísticas del mercado
/contacto - Información de contacto
/web - Ir a la página web
/perfil - Ver tu información

🎯 **Búsqueda rápida:**
• Escribe el modelo: "Toyota Corolla"
• Especifica año: "Honda 2020"
• Rango de precio: "autos hasta $15000"

¿Necesitas ayuda específica? ¡Solo escríbeme!
`;
    await ctx.reply(helpMessage, { parse_mode: "Markdown" });
  });

  // Comando /buscar
  botInstance.command("buscar", async (ctx) => {
    const searchMessage = `
🔍 **Búsqueda de Vehículos**

Para buscar vehículos específicos, puedes:

1️⃣ **Escribir el modelo:** "Toyota Corolla"
2️⃣ **Especificar año:** "Honda 2020"
3️⃣ **Rango de precio:** "autos hasta $15000"

También puedes visitar nuestra web para búsquedas avanzadas:
👉 https://1auto.market/vehicleList

**¿Qué tipo de vehículo buscas?**
`;
    await ctx.reply(searchMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🌐 Buscar en Web",
              url: "https://1auto.market/vehicleList",
            },
          ],
          [
            { text: "🚗 Sedán", callback_data: "search_sedan" },
            { text: "🚙 SUV", callback_data: "search_suv" },
          ],
          [
            { text: "🏎️ Deportivo", callback_data: "search_sport" },
            { text: "🚐 Pickup", callback_data: "search_pickup" },
          ],
        ],
      },
    });
  });

  // Comando /notificaciones
  botInstance.command("notificaciones", async (ctx) => {
    const notificationMessage = `
🔔 **Sistema de Notificaciones**

¡Recibe alertas cuando aparezcan vehículos que te interesen!

**Para activar notificaciones:**
1️⃣ Visita: https://1auto.market/register
2️⃣ Crea tu cuenta
3️⃣ Conecta tu Telegram en tu perfil

**Una vez conectado, recibirás:**
• Nuevos vehículos que coincidan con tus preferencias
• Cambios de precio
• Vehículos similares a los que has visto
• Actualizaciones de tus anuncios

¿Te ayudo con algo más?
`;
    await ctx.reply(notificationMessage, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔗 Vincular Cuenta",
              url: "https://1auto.market/register",
            },
          ],
        ],
      },
    });
  });

  // Comando /estadisticas
  botInstance.command("estadisticas", async (ctx) => {
    await ctx.reply(
      `
📊 **Estadísticas del Mercado**

Para ver estadísticas detalladas del mercado automotriz:

👉 https://1auto.market/adminPanel/dashboard

**Incluye:**
• Vehículos más populares
• Tendencias de precios
• Análisis por marca y modelo
• Reportes de ventas

¿Te interesa alguna estadística específica?
`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Ver Estadísticas",
                url: "https://1auto.market/adminPanel/dashboard",
              },
            ],
          ],
        },
      }
    );
  });

  // Comando /contacto
  botInstance.command("contacto", async (ctx) => {
    await ctx.reply(
      `
📞 **Información de Contacto**

🌐 **Web:** https://1auto.market
📧 **Email:** designdevproenmanuel@gmail.com
💬 **Telegram:** @Automarket_enma_bot
📱 **WhatsApp:** [Disponible en la web]

🕒 **Horario de atención:**
• Lunes a Viernes: 8:00 AM - 6:00 PM
• Sábados: 9:00 AM - 2:00 PM

📍 **También puedes contactarnos desde:**
👉 https://1auto.market/contact

¿En qué más puedo ayudarte?
`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📧 Contactar", url: "https://1auto.market/contact" }],
          ],
        },
      }
    );
  });

  // Comando /web
  botInstance.command("web", async (ctx) => {
    await ctx.reply(
      `
🌐 **AutoMarket - Tu Marketplace de Vehículos**

👉 https://1auto.market

**En nuestra web puedes:**
🚗 Ver todos los vehículos disponibles
🔍 Usar filtros avanzados de búsqueda
📝 Publicar tu vehículo para venta
💰 Ver precios y hacer comparaciones
📊 Acceder a estadísticas del mercado

**¡La experiencia completa te está esperando!**
`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🌐 Ir a AutoMarket", url: "https://1auto.market" }],
            [
              {
                text: "🚗 Ver Vehículos",
                url: "https://1auto.market/vehicleList",
              },
              { text: "📝 Publicar", url: "https://1auto.market/postAd" },
            ],
          ],
        },
      }
    );
  });

  // Manejar callbacks - CORREGIDO: Solo un handler
  botInstance.on("callback_query", async (ctx) => {
    // Verificar que el callback_query tenga la propiedad 'data'
    if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) {
      await ctx.answerCbQuery();
      return;
    }

    const data = ctx.callbackQuery.data;

    if (data?.startsWith("search_")) {
      const type = data.replace("search_", "");
      const searchUrl = `https://1auto.market/vehicleList?type=${type}`;

      await ctx.answerCbQuery();
      await ctx.reply(
        `
🔍 **Búsqueda: ${type.toUpperCase()}**

👉 ${searchUrl}

¡Ve todos los ${type}s disponibles!
`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: `🚗 Ver ${type.toUpperCase()}s`, url: searchUrl }],
            ],
          },
        }
      );
    } else if (data === "contact_support") {
      await ctx.answerCbQuery();
      await ctx.reply(
        `
📞 **Soporte AutoMarket**

¿Necesitas ayuda? Estamos aquí para ti:

📧 **Email:** designdevproenmanuel@gmail.com
🌐 **Web:** https://1auto.market/contact

¿En qué más puedo ayudarte?
`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📧 Contactar", url: "https://1auto.market/contact" }],
            ],
          },
        }
      );
    } else {
      // Manejar otros callbacks no reconocidos
      await ctx.answerCbQuery("Opción no reconocida");
    }
  });

  // Responder a mensajes de texto libre
  botInstance.on("text", async (ctx) => {
    // Verificación mejorada para message.text usando type guards
    if (!ctx.message || !("text" in ctx.message) || !ctx.message.text) {
      return;
    }

    const text = ctx.message.text.toLowerCase();

    // Skip if it's a command
    if (text.startsWith("/")) return;

    if (
      text.includes("precio") ||
      text.includes("costo") ||
      text.includes("valor")
    ) {
      await ctx.reply(
        `
💰 **Consultas de Precios**

Para consultar precios específicos:
1️⃣ Visita: https://1auto.market/vehicleList
2️⃣ Usa los filtros de precio
3️⃣ Compara diferentes opciones

¿Tienes un presupuesto específico en mente?
`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "💰 Ver Precios",
                  url: "https://1auto.market/vehicleList",
                },
              ],
            ],
          },
        }
      );
    } else if (
      text.includes("vender") ||
      text.includes("publicar") ||
      text.includes("anuncio")
    ) {
      await ctx.reply(
        `
📝 **Publicar tu Vehículo**

Para vender tu vehículo:
1️⃣ Ve a: https://1auto.market/postAd
2️⃣ Completa el formulario
3️⃣ Sube fotos de calidad
4️⃣ ¡Publica tu anuncio!

Tu vehículo será visible para miles de compradores potenciales.

¿Te ayudo con el proceso?
`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📝 Publicar Ahora",
                  url: "https://1auto.market/postAd",
                },
              ],
            ],
          },
        }
      );
    } else if (
      text.includes("hola") ||
      text.includes("buenos") ||
      text.includes("buenas")
    ) {
      await ctx.reply(`
¡Hola! 👋 Bienvenido a AutoMarket Bot.

¿En qué puedo ayudarte hoy?
• /buscar - Encontrar vehículos
• /notificaciones - Configurar alertas
• /web - Visitar nuestra página

¡Estoy aquí para ayudarte! 🚗
`);
    } else {
      // Buscar si el texto parece ser una búsqueda de vehículo
      const searchUrl = `https://1auto.market/vehicleList?search=${encodeURIComponent(ctx.message.text)}`;

      await ctx.reply(
        `
🔍 Buscando: "${ctx.message.text}"

👉 ${searchUrl}

Si no encuentras lo que buscas, también puedes:
• /help - Ver todos los comandos
• /contacto - Contactarnos directamente

¿Te ayudo con algo más específico?
`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Ver Resultados", url: searchUrl }],
              [{ text: "📞 Contactar", callback_data: "contact_support" }],
            ],
          },
        }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar que es una actualización válida de Telegram
    if (!body.message && !body.callback_query) {
      return NextResponse.json({ ok: true });
    }

    // Configurar comandos si es la primera vez
    setupBotCommands();

    const telegramBot = getBot();

    // Procesar la actualización
    await telegramBot.getBot().handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error processing Telegram webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram bot webhook is running",
    bot: process.env.TELEGRAM_BOT_USERNAME,
    timestamp: new Date().toISOString(),
  });
}