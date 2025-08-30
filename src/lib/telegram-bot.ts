// src/lib/telegram-bot.ts
import { Telegraf, Context } from "telegraf";
import { getDb } from "./mongodb";
import { Filter } from "mongodb";
import {
  ApprovalStatus,
  Currency,
} from "@/types/types";
import { VehicleDataMongo } from "@/lib/vehicleService";
import { VehicleBot } from "@/lib/telegram-notifications";

// Interfaz para SellerContact
interface SellerContact {
  name: string;
  phone?: string;
  email?: string;
}

// Interfaz para los filtros de sesión
interface SessionFilters {
  maxPrice?: number;
  year?: number;
  query?: string;
  brand?: string;
  model?: string;
}

interface BotContext extends Context {
  session?: {
    step?: string;
    searchFilters?: SessionFilters;
    userId?: string;
  };
}

// Interfaz para los filtros de búsqueda
interface SearchFilters {
  maxPrice?: number;
  year?: number;
  query?: string;
}

// Interfaz para documentos de MongoDB con un _id garantizado (ObjectId)
type WithId<T> = T & { _id: import("mongodb").ObjectId };

class TelegramBot {
  private bot: Telegraf<BotContext>;
  private adminChatIds: string[] = [];

  // Método para convertir VehicleDataMongo a VehicleBot
  private convertToVehicleBot(mongoDoc: WithId<VehicleDataMongo>): VehicleBot {
    const vehicleBot: VehicleBot = {
      _id: mongoDoc._id.toString(),
      brand: mongoDoc.brand || 'Marca no especificada',
      model: mongoDoc.model || 'Modelo no especificado',
      year: mongoDoc.year || new Date().getFullYear(),
      price: mongoDoc.price || 0,
      ownerName: mongoDoc.sellerContact?.name || 'Usuario no especificado',
      currency: mongoDoc.currency ?? ("USD" as Currency),
    };

    interface VehicleBotWithOptionals extends VehicleBot {
      location?: string;
      status?: string;
      description?: string;
      images?: string[];
      mileage?: number;
      condition?: string;
      transmission?: string;
      fuelType?: string;
      color?: string;
      views?: number;
      referenceNumber?: string;
      telegramUserId?: string;
      ownerTelegramId?: string;
      createdAt?: Date;
      updatedAt?: Date;
      category?: string;
      sellerContact?: SellerContact; // Tipo específico en lugar de any
    }

    const result: VehicleBotWithOptionals = vehicleBot;

    if (mongoDoc.location) result.location = mongoDoc.location;
    if (mongoDoc.status) result.status = mongoDoc.status;
    if (mongoDoc.description) result.description = mongoDoc.description;
    if (mongoDoc.images) result.images = mongoDoc.images;
    if (mongoDoc.mileage) result.mileage = mongoDoc.mileage;
    if (mongoDoc.condition) result.condition = mongoDoc.condition;
    if (mongoDoc.transmission) result.transmission = mongoDoc.transmission;
    if (mongoDoc.fuelType) result.fuelType = mongoDoc.fuelType;
    if (mongoDoc.color) result.color = mongoDoc.color;
    if (mongoDoc.views) result.views = mongoDoc.views;
    if (mongoDoc.referenceNumber) result.referenceNumber = mongoDoc.referenceNumber;
    if (mongoDoc.telegramUserId) result.telegramUserId = mongoDoc.telegramUserId;
    if (mongoDoc.ownerTelegramId) result.ownerTelegramId = mongoDoc.ownerTelegramId;
    if (mongoDoc.createdAt) result.createdAt = mongoDoc.createdAt;
    if (mongoDoc.updatedAt) result.updatedAt = mongoDoc.updatedAt;
    if (mongoDoc.category) result.category = mongoDoc.category;
    if (mongoDoc.sellerContact) result.sellerContact = mongoDoc.sellerContact;

    return result as VehicleBot;
  }

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN no está configurado");
    }

    this.bot = new Telegraf<BotContext>(token);

    const adminIds = process.env.TELEGRAM_ADMIN_CHAT_IDS;
    if (adminIds) {
      this.adminChatIds = adminIds.split(",").map((id) => id.trim());
    }

    this.setupCommands();
    this.setupHandlers();
  }

  private setupCommands() {
    this.bot.start(async (ctx) => {
      const payload = ctx.startPayload;

      if (payload) {
        // Lógica para manejar la vinculación de cuenta a través del payload
        try {
          const db = await getDb();
          const usersCollection = db.collection("users");

          const user = await usersCollection.findOne({
            telegramLinkToken: payload,
            telegramLinkTokenExpires: { $gt: new Date() },
          });

          if (user) {
            await usersCollection.updateOne(
              { _id: user._id },
              {
                $set: { telegramUserId: ctx.from.id.toString(), telegramUsername: ctx.from.username || null },
                $unset: { telegramLinkToken: "", telegramLinkTokenExpires: "" },
              }
            );
            ctx.reply(
              `✅ ¡Éxito! Tu cuenta de 1auto.market ha sido vinculada a este chat de Telegram.`
            );
          } else {
            ctx.reply(
              `❌ El enlace de vinculación es inválido o ha expirado. Por favor, genera uno nuevo desde tu perfil en la web.`
            );
          }
        } catch (error) {
          console.error("Error al vincular cuenta de Telegram:", error);
          ctx.reply(
            "❌ Ocurrió un error al intentar vincular tu cuenta. Inténtalo más tarde."
          );
        }
      } else {
        // Mensaje de bienvenida por defecto si no hay payload
        const welcomeMessage = `
🚗 ¡Bienvenido a Auto Market Bot! 🚗

Soy tu asistente virtual para consultar vehículos, motos y maquinaria pesada.

📋 *Comandos disponibles:*
/buscar - Buscar vehículos
/nuevos - Ver últimos anuncios
/marcas - Ver marcas disponibles
/contacto - Información de contacto
/ayuda - Ver todos los comandos
/estado - Ver estado de tu anuncio (usuarios registrados)

¿En qué puedo ayudarte hoy?
      `;
        ctx.reply(welcomeMessage, { parse_mode: "Markdown" });
      }
    });

    this.bot.help((ctx) => {
      const helpMessage = `
🆘 *Comandos disponibles:*

🔍 /buscar - Buscar vehículos por marca, modelo o precio
🆕 /nuevos - Ver los últimos anuncios publicados
🏷️ /marcas - Ver todas las marcas disponibles
📞 /contacto - Información de contacto
📊 /estado - Ver estado de tu anuncio
❓ /ayuda - Mostrar esta ayuda

*Para búsquedas específicas:*
- Escribe el nombre de una marca (ej: "Toyota")
- Escribe "precio max 50000" para filtrar por precio
- Escribe "año 2020" para filtrar por año

¿Necesitas ayuda con algo específico?
      `;
      ctx.reply(helpMessage, { parse_mode: "Markdown" });
    });

    this.bot.command("buscar", (ctx) => {
      const searchMessage = `
🔍 *Buscar Vehículos*

Puedes buscar de las siguientes maneras:

1️⃣ Por marca: "Toyota", "Honda", "Ford"
2️⃣ Por tipo: "Carro", "Moto", "Camión"
3️⃣ Por precio: "precio max 50000"
4️⃣ Por año: "año 2020"

¿Qué tipo de vehículo buscas?
      `;
      ctx.reply(searchMessage, { parse_mode: "Markdown" });

      if (!ctx.session) ctx.session = {};
      ctx.session.step = "searching";
    });

    this.bot.command("nuevos", async (ctx) => {
      try {
        const vehicles = await this.getLatestVehicles(5);

        if (vehicles.length === 0) {
          ctx.reply("No hay anuncios nuevos disponibles en este momento.");
          return;
        }

        let message = "🆕 *Últimos anuncios publicados:*\n\n";

        vehicles.forEach((vehicle, index) => {
          const make = vehicle.brand || "Marca no especificada";
          const model = vehicle.model || "Modelo no especificado";
          const year = vehicle.year || "Año no especificado";
          const price = vehicle.price
            ? `${vehicle.price.toLocaleString()}`
            : "Precio no especificado";

          message += `${index + 1}. *${make} ${model}* (${year})\n`;
          message += `💰 ${price}\n`;
          message += `📍 ${vehicle.location || "No especificada"}\n`;
          message += `🔗 Ver detalles: ${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicle._id}\n\n`;
        });

        ctx.reply(message, { parse_mode: "Markdown" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error al obtener vehículos:", errorMessage);
        ctx.reply(
          "❌ Error al obtener los últimos anuncios. Inténtalo más tarde."
        );
      }
    });

    this.bot.command("marcas", async (ctx) => {
      try {
        const brands = await this.getAvailableBrands();

        if (brands.length === 0) {
          ctx.reply("No hay marcas disponibles en este momento.");
          return;
        }

        let message = "🏷️ *Marcas disponibles:*\n\n";
        brands.forEach((brand) => {
          message += `• ${brand}\n`;
        });

        message +=
          "\n💡 Escribe el nombre de una marca para ver sus vehículos disponibles.";

        ctx.reply(message, { parse_mode: "Markdown" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error al obtener marcas:", errorMessage);
        ctx.reply("❌ Error al obtener las marcas. Inténtalo más tarde.");
      }
    });

    this.bot.command("contacto", (ctx) => {
      const contactMessage = `
📞 *Información de Contacto*

🌐 Sitio web: ${process.env.NEXT_PUBLIC_BASE_URL}
📧 Email: ${process.env.CONTACT_RECIPIENT_EMAIL}
📱 WhatsApp: +58412-9417603

🕒 *Horario de atención:*
Lunes a Viernes: 8:00 AM - 6:00 PM
Sábados: 9:00 AM - 4:00 PM

¿Necesitas ayuda adicional?
      `;
      ctx.reply(contactMessage, { parse_mode: "Markdown" });
    });

    this.bot.command("estado", async (ctx) => {
      const telegramUserId = ctx.from?.id.toString();

      if (!telegramUserId) {
        ctx.reply("❌ No pude identificar tu usuario.");
        return;
      }

      try {
        const userVehicles = await this.getUserVehicles(telegramUserId);

        if (userVehicles.length === 0) {
          ctx.reply(`
📝 No tienes anuncios registrados.

Para publicar un anuncio:
1. Regístrate en: ${process.env.NEXT_PUBLIC_BASE_URL}/register
2. Publica tu vehículo
3. Vincula tu cuenta de Telegram

¿Necesitas ayuda?
          `);
          return;
        }

        let message = "📊 *Estado de tus anuncios:*\n\n";

        userVehicles.forEach((vehicle, index) => {
          const status = this.getStatusEmoji(vehicle.status || "unknown");
          const make = vehicle.brand || "Marca no especificada";
          const model = vehicle.model || "Modelo no especificado";
          const price = vehicle.price
            ? `${vehicle.price.toLocaleString()}`
            : "Precio no especificado";

          message += `${index + 1}. ${status} *${make} ${model}*\n`;
          message += `   Estado: ${vehicle.status || "Desconocido"}\n`;
          message += `   Precio: ${price}\n\n`;
        });

        ctx.reply(message, { parse_mode: "Markdown" });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error al obtener estado:", errorMessage);
        ctx.reply("❌ Error al verificar el estado. Inténtalo más tarde.");
      }
    });
  }

  private setupHandlers() {
    this.bot.on("text", async (ctx) => {
      const text = ctx.message.text.toLowerCase();

      if (text.startsWith("/")) return;

      try {
        if (text.includes("precio max")) {
          const maxPrice = parseInt(text.replace(/\D/g, ""));
          await this.searchByPrice(ctx, maxPrice);
        } else if (text.includes("año")) {
          const year = parseInt(text.replace(/\D/g, ""));
          await this.searchByYear(ctx, year);
        } else {
          await this.searchByText(ctx, text);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Error en búsqueda:", errorMessage);
        ctx.reply("❌ Error en la búsqueda. Inténtalo con otros términos.");
      }
    });
  }

  private async searchByPrice(ctx: BotContext, maxPrice: number) {
    const vehicles = await this.searchVehicles({ maxPrice });
    this.sendSearchResults(
      ctx,
      vehicles,
      `precio máximo $${maxPrice.toLocaleString()}`
    );
  }

  private async searchByYear(ctx: BotContext, year: number) {
    const vehicles = await this.searchVehicles({ year });
    this.sendSearchResults(ctx, vehicles, `año ${year}`);
  }

  private async searchByText(ctx: BotContext, query: string) {
    const vehicles = await this.searchVehicles({ query });
    this.sendSearchResults(ctx, vehicles, query);
  }

  private async sendSearchResults(
    ctx: BotContext,
    vehicles: VehicleBot[],
    searchTerm: string
  ) {
    if (vehicles.length === 0) {
      ctx.reply(`🔍 No encontré vehículos para "${searchTerm}". 

💡 *Sugerencias:*
- Verifica la ortografía
- Usa términos más generales
- Prueba con /marcas para ver opciones disponibles`);
      return;
    }

    if (vehicles.length > 5) {
      ctx.reply(
        `🔍 Encontré ${vehicles.length} vehículos para "${searchTerm}". Mostrando los primeros 5:`
      );
      vehicles = vehicles.slice(0, 5);
    }

    let message = `🔍 *Resultados para "${searchTerm}":*\n\n`;

    vehicles.forEach((vehicle, index) => {
      const make = vehicle.brand || "Marca no especificada";
      const model = vehicle.model || "Modelo no especificado";
      const year = vehicle.year || "Año no especificado";
      const price = vehicle.price
        ? `${vehicle.price.toLocaleString()}`
        : "Precio no especificado";

      message += `${index + 1}. *${make} ${model}* (${year})\n`;
      message += `💰 ${price}\n`;
      message += `📍 ${vehicle.location || "No especificada"}\n`;
      message += `🔗 ${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicle._id}\n\n`;
    });

    ctx.reply(message, { parse_mode: "Markdown" });
  }

  private async getLatestVehicles(limit: number = 5): Promise<VehicleBot[]> {
    try {
      const db = await getDb();
      const vehicles = await db
        .collection<VehicleDataMongo>("vehicles")
        .find({ status: ApprovalStatus.APPROVED })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      return vehicles.map((v) =>
        this.convertToVehicleBot(v as WithId<VehicleDataMongo>)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error obteniendo últimos vehículos:", errorMessage);
      return [];
    }
  }

  private async getAvailableBrands(): Promise<string[]> {
    try {
      const db = await getDb();
      const brands = await db
        .collection<VehicleDataMongo>("vehicles")
        .distinct("brand", { status: ApprovalStatus.APPROVED });

      return brands.filter(Boolean);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error obteniendo marcas:", errorMessage);
      return [];
    }
  }

  private async getUserVehicles(telegramUserId: string): Promise<VehicleBot[]> {
    try {
      const db = await getDb();
      const vehicles = await db
        .collection<VehicleDataMongo>("vehicles")
        .find({
          $or: [{ telegramUserId }, { ownerTelegramId: telegramUserId }],
        })
        .toArray();

      return vehicles.map((v) =>
        this.convertToVehicleBot(v as WithId<VehicleDataMongo>)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error obteniendo vehículos del usuario:", errorMessage);
      return [];
    }
  }

  private async searchVehicles(filters: SearchFilters): Promise<VehicleBot[]> {
    try {
      const db = await getDb();
      const query: Filter<VehicleDataMongo> = { status: ApprovalStatus.APPROVED };

      if (filters.maxPrice) {
        query.price = { $lte: filters.maxPrice };
      }

      if (filters.year) {
        query.year = filters.year;
      }

      if (filters.query) {
        query.$or = [
          { brand: { $regex: filters.query, $options: "i" } },
          { model: { $regex: filters.query, $options: "i" } },
          { category: { $regex: filters.query, $options: "i" } },
        ];
      }

      const vehicles = await db
        .collection<VehicleDataMongo>("vehicles")
        .find(query)
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray();

      return vehicles.map((v) =>
        this.convertToVehicleBot(v as WithId<VehicleDataMongo>)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error en búsqueda de vehículos:", errorMessage);
      return [];
    }
  }

  private getStatusEmoji(status: string): string {
    const statusEmojis: { [key: string]: string } = {
      pending: "⏳",
      approved: "✅",
      rejected: "❌",
      sold: "🎉",
    };
    return statusEmojis[status] || "❓";
  }

  public async notifyAdmins(message: string) {
    for (const chatId of this.adminChatIds) {
      try {
        await this.bot.telegram.sendMessage(chatId, message, {
          parse_mode: "Markdown",
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `Error enviando mensaje a admin ${chatId}:`,
          errorMessage
        );
      }
    }
  }

  public async notifyNewVehicle(vehicle: VehicleBot) {
    const make = vehicle.brand || "Marca no especificada";
    const model = vehicle.model || "Modelo no especificado";
    const year = vehicle.year || "Año no especificado";
    const price = vehicle.price
      ? `${vehicle.price.toLocaleString()}`
      : "Precio no especificado";
    const ownerName = vehicle.ownerName || "No especificado";

    const message = `
🚗 *Nuevo vehículo registrado*

📝 *Detalles:*
• Marca: ${make}
• Modelo: ${model}
• Año: ${year}
• Precio: ${price}
• Usuario: ${ownerName}

🔗 Ver en admin: ${process.env.NEXT_PUBLIC_BASE_URL}/adminPanel/dashboard

⚠️ Requiere aprobación
    `;

    await this.notifyAdmins(message);
  }

  public async notifyPaymentReceived(vehicleId: string, amount: number) {
    const message = `
💰 *Pago recibido*

💵 Monto: $${amount.toLocaleString()}
🆔 Vehículo: ${vehicleId}
📅 Fecha: ${new Date().toLocaleDateString()}

🔗 Verificar: ${process.env.NEXT_PUBLIC_BASE_URL}/adminPanel/dashboard

✅ Requiere validación
    `;

    await this.notifyAdmins(message);
  }

  public start() {
    console.log("🤖 Bot de Telegram iniciado");
    this.bot.launch();

    process.once("SIGINT", () => this.bot.stop("SIGINT"));
    process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
  }

  public getBot() {
    return this.bot;
  }
}

export default TelegramBot;