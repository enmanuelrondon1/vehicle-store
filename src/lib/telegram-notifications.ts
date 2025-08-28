// src/lib/telegram-notifications.ts
import TelegramBot from "./telegram-bot";
import clientPromise from "@/lib/mongodb";

export interface VehicleBot {
  _id?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency?: string;
  status?: string;
  mileage?: number;
  color?: string;
  location?: string;
  images?: string[];
  features?: string[];
  ownerName?: string;
  telegramUserId?: string;
  ownerTelegramId?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  engine?: string;
  description?: string;
  contactInfo?: ContactInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface para información de contacto
interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
}

// Interface para filtros de usuarios
interface UserFilters {
  interestedVehicles?: string;
  weeklyDigest?: { $ne: boolean };
  location?: string;
  priceRange?: { min: number; max: number };
}

// Interface para datos de contacto
interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  createdAt?: Date;
}

// Interface mejorada para query de base de datos - eliminamos el uso de 'any'
interface DatabaseQuery extends UserFilters {
  telegramUserId: { $exists: boolean; $ne: null };
  notificationsEnabled: { $ne: boolean };
}

export interface VehicleNotification {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  location: string;
  imageUrl?: string;
  features: string[];
  ownerTelegramId?: string;
}

export interface MarketSummary {
  newVehicles: number;
  averagePrice: number;
  mostPopular: string;
  trend: string;
  recommendations: string[];
}

class TelegramNotifications {
  private static instance: TelegramBot | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://1auto.market";
  }

  static getInstance(): TelegramBot {
    if (!TelegramNotifications.instance) {
      TelegramNotifications.instance = new TelegramBot();
    }
    return TelegramNotifications.instance;
  }

  // Obtener usuarios suscritos a notificaciones
  private static async getSubscribedUsers(filters?: UserFilters): Promise<string[]> {
    try {
      const client = await clientPromise;
      const db = client.db("vehicle_store");
      const usersCollection = db.collection("users");

      const query: DatabaseQuery = {
        telegramUserId: { $exists: true, $ne: null },
        notificationsEnabled: { $ne: false },
        ...filters, // Spread operator para añadir filtros de forma type-safe
      };

      const users = await usersCollection.find(query).toArray();
      return users
        .map((user) => user.telegramUserId)
        .filter(Boolean) as string[];
    } catch (error) {
      console.error("Error obteniendo usuarios suscritos:", error);
      return [];
    }
  }

  // Notificar nuevo vehículo registrado (para admins)
  static async notifyNewVehicle(vehicleData: VehicleBot) {
    try {
      const bot = TelegramNotifications.getInstance();

      // Notificar a admins
      await bot.notifyNewVehicle(vehicleData);

      // Notificar a usuarios interesados
      await TelegramNotifications.notifyInterestedUsers(vehicleData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        "Error enviando notificación de nuevo vehículo:",
        errorMessage
      );
    }
  }

  // Notificar a usuarios que podrían estar interesados
  static async notifyInterestedUsers(vehicleData: VehicleBot) {
    try {
      const bot = TelegramNotifications.getInstance();
      const subscribedUsers = await TelegramNotifications.getSubscribedUsers();

      if (subscribedUsers.length === 0) return;

      const notification: VehicleNotification = {
        id: vehicleData._id?.toString() || "",
        brand: vehicleData.brand,
        model: vehicleData.model,
        year: vehicleData.year,
        price: vehicleData.price,
        location: vehicleData.location || "No especificada",
        imageUrl: vehicleData.images?.[0] || undefined,
        features: vehicleData.features || [],
      };

      const message = `🚗 **¡Nuevo Vehículo Disponible!**

🔸 **${notification.brand} ${notification.model} ${notification.year}**
💰 **Precio:** ${notification.price.toLocaleString()}
📍 **Ubicación:** ${notification.location}

✨ **Características destacadas:**
${
  notification.features
    .slice(0, 3)
    .map((feature) => `• ${feature}`)
    .join("\n") || "• Información disponible en el anuncio"
}

👀 **Ver detalles completos:**
${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${notification.id}`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🔍 Ver Detalles",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${notification.id}`,
            },
            {
              text: "💬 Contactar",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            },
          ],
          [
            {
              text: "🌐 Ver Más Vehículos",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/vehicleList`,
            },
          ],
        ],
      };

      // Enviar a todos los usuarios suscritos (máximo 30 por minuto para evitar rate limits)
      for (let i = 0; i < subscribedUsers.length; i += 30) {
        const batch = subscribedUsers.slice(i, i + 30);

        await Promise.all(
          batch.map(async (chatId) => {
            try {
              await bot.getBot().telegram.sendMessage(chatId, message, {
                parse_mode: "Markdown",
                reply_markup: keyboard,
              });
            } catch (error) {
              console.error(`Error enviando notificación a ${chatId}:`, error);
            }
          })
        );

        // Pausa de 1 minuto entre batches si hay más
        if (i + 30 < subscribedUsers.length) {
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error notificando usuarios interesados:", errorMessage);
    }
  }

  // Notificar pago recibido
  static async notifyPaymentReceived(vehicleId: string, amount: number) {
    try {
      const bot = TelegramNotifications.getInstance();
      await bot.notifyPaymentReceived(vehicleId, amount);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error enviando notificación de pago:", errorMessage);
    }
  }

  // Notificar aprobación de vehículo
  static async notifyVehicleApproved(vehicleData: VehicleBot) {
    try {
      const bot = TelegramNotifications.getInstance();

      if (vehicleData.ownerTelegramId) {
        const message = `🎉 **¡Tu anuncio ha sido aprobado!**

📝 **Detalles:**
• **Vehículo:** ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
• **Precio:** ${vehicleData.price?.toLocaleString()}
• **Estado:** ✅ Publicado y visible

🔗 **Ver anuncio:** ${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicleData._id}

**¡Tu anuncio ya está visible para todos los usuarios!**

📊 **Próximos pasos:**
• Mantén tu información actualizada
• Responde rápidamente a los interesados
• Puedes editar tu anuncio cuando quieras`;

        await bot
          .getBot()
          .telegram.sendMessage(vehicleData.ownerTelegramId, message, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "👀 Ver Anuncio",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicleData._id}`,
                  },
                ],
                [
                  {
                    text: "✏️ Editar",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/postAd?edit=${vehicleData._id}`,
                  },
                  {
                    text: "📊 Estadísticas",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
                  },
                ],
              ],
            },
          });
      }

      // También notificar a usuarios interesados
      await TelegramNotifications.notifyInterestedUsers(vehicleData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error enviando notificación de aprobación:", errorMessage);
    }
  }

  // Notificar rechazo de vehículo
  static async notifyVehicleRejected(vehicleData: VehicleBot, reason: string) {
    try {
      const bot = TelegramNotifications.getInstance();

      if (vehicleData.ownerTelegramId) {
        const message = `❌ **Tu anuncio ha sido rechazado**

📝 **Vehículo:** ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
📋 **Motivo:** ${reason}

💡 **¿Qué puedes hacer?**
• Revisa la información proporcionada
• Corrige los datos necesarios
• Vuelve a enviar tu anuncio

🔗 **Editar anuncio:** ${process.env.NEXT_PUBLIC_BASE_URL}/postAd?edit=${vehicleData._id}

❓ **¿Necesitas ayuda?**
• Usa el comando /contacto
• Visita nuestra página de ayuda
• Contacta a nuestro equipo de soporte`;

        await bot
          .getBot()
          .telegram.sendMessage(vehicleData.ownerTelegramId, message, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "✏️ Corregir Anuncio",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/postAd?edit=${vehicleData._id}`,
                  },
                ],
                [
                  {
                    text: "💬 Contactar Soporte",
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
                  },
                  { text: "❓ Ayuda", callback_data: "help_command" },
                ],
              ],
            },
          });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error enviando notificación de rechazo:", errorMessage);
    }
  }

  // Notificar cambio de precio
  static async notifyPriceChange(vehicleData: VehicleBot, oldPrice: number) {
    try {
      const bot = TelegramNotifications.getInstance();
      const subscribedUsers = await TelegramNotifications.getSubscribedUsers({
        interestedVehicles: vehicleData._id,
      });

      if (subscribedUsers.length === 0) return;

      const priceChange = vehicleData.price - oldPrice;
      const isReduction = priceChange < 0;
      const emoji = isReduction ? "📉" : "📈";
      const changeText = isReduction ? "REBAJA" : "AUMENTO";

      const message = `${emoji} **¡${changeText} DE PRECIO!**

🚗 **${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}**
💰 **Precio anterior:** ${oldPrice.toLocaleString()}
💰 **Precio actual:** ${vehicleData.price.toLocaleString()}
${isReduction ? "💸" : "📊"} **Diferencia:** ${isReduction ? "-" : "+"}${Math.abs(priceChange).toLocaleString()}

📍 **Ubicación:** ${vehicleData.location || "No especificada"}

👀 **Ver detalles:**
${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicleData._id}`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🔍 Ver Ahora",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicleData._id}`,
            },
            {
              text: "💬 Contactar",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
            },
          ],
        ],
      };

      // Enviar notificación a usuarios interesados
      for (const chatId of subscribedUsers) {
        try {
          await bot.getBot().telegram.sendMessage(chatId, message, {
            parse_mode: "Markdown",
            reply_markup: keyboard,
          });
        } catch (error) {
          console.error(
            `Error enviando notificación de precio a ${chatId}:`,
            error
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        "Error enviando notificación de cambio de precio:",
        errorMessage
      );
    }
  }

  // Enviar resumen semanal del mercado
  static async sendMarketSummary(summary: MarketSummary) {
    try {
      const bot = TelegramNotifications.getInstance();
      const subscribedUsers = await TelegramNotifications.getSubscribedUsers({
        weeklyDigest: { $ne: false },
      });

      if (subscribedUsers.length === 0) return;

      const message = `📊 **Resumen del Mercado Semanal**

🚗 **Nuevos vehículos:** ${summary.newVehicles}
💰 **Precio promedio:** ${summary.averagePrice.toLocaleString()}
🔥 **Más popular:** ${summary.mostPopular}
📈 **Tendencia:** ${summary.trend}

🎯 **Recomendaciones para ti:**
${summary.recommendations.map((rec: string, idx: number) => `${idx + 1}. ${rec}`).join("\n")}

👀 **Ver mercado completo:**
${process.env.NEXT_PUBLIC_BASE_URL}/vehicleList`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: "🌐 Ver Mercado",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/vehicleList`,
            },
            {
              text: "📊 Estadísticas",
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/adminPanel/dashboard`,
            },
          ],
        ],
      };

      // Enviar en batches para evitar rate limits
      for (let i = 0; i < subscribedUsers.length; i += 30) {
        const batch = subscribedUsers.slice(i, i + 30);

        await Promise.all(
          batch.map(async (chatId) => {
            try {
              await bot.getBot().telegram.sendMessage(chatId, message, {
                parse_mode: "Markdown",
                reply_markup: keyboard,
              });
            } catch (error) {
              console.error(
                `Error enviando resumen semanal a ${chatId}:`,
                error
              );
            }
          })
        );

        // Pausa entre batches
        if (i + 30 < subscribedUsers.length) {
          await new Promise((resolve) => setTimeout(resolve, 60000));
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error enviando resumen del mercado:", errorMessage);
    }
  }

  // Notificar mensaje de contacto
  static async notifyContactMessage(contactData: ContactData) {
    try {
      const bot = TelegramNotifications.getInstance();
      const adminChatIds =
        process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(",") || [];

      const message = `📧 **Nuevo Mensaje de Contacto**

👤 **Nombre:** ${contactData.name}
📧 **Email:** ${contactData.email}
📞 **Teléfono:** ${contactData.phone || "No proporcionado"}

💬 **Mensaje:**
${contactData.message}

🕒 **Fecha:** ${new Date().toLocaleString("es-ES")}`;

      for (const chatId of adminChatIds) {
        if (chatId.trim()) {
          try {
            await bot.getBot().telegram.sendMessage(chatId.trim(), message, {
              parse_mode: "Markdown",
            });
          } catch (error) {
            console.error(
              `Error enviando notificación de contacto a ${chatId}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error enviando notificación de contacto:", errorMessage);
    }
  }
}

export { TelegramNotifications };
export default TelegramNotifications;

// Hooks para integrar en tus APIs existentes
export const useTelegramNotifications = () => {
  return {
    notifyNewVehicle: TelegramNotifications.notifyNewVehicle,
    notifyPaymentReceived: TelegramNotifications.notifyPaymentReceived,
    notifyVehicleApproved: TelegramNotifications.notifyVehicleApproved,
    notifyVehicleRejected: TelegramNotifications.notifyVehicleRejected,
    notifyPriceChange: TelegramNotifications.notifyPriceChange,
    sendMarketSummary: TelegramNotifications.sendMarketSummary,
    notifyContactMessage: TelegramNotifications.notifyContactMessage,
  };
};

// Instancia para uso directo
export const telegramNotifier = new TelegramNotifications();