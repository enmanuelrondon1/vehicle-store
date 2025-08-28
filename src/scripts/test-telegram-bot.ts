// src/scripts/test-telegram-bot.ts
// Script para probar todas las funcionalidades del bot

// IMPORTANTE: Cargar variables de entorno antes de cualquier importación
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar .env.local desde la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Ahora importar el resto de módulos
import {
  TelegramNotifications,
  VehicleBot,
} from "@/lib/telegram-notifications";

// Define tipos específicos en lugar de usar 'any'
type TestType = "connection" | "webhook" | "commands" | "notification";

class BotTester {
  // Prueba 1: Verificar conexión del bot
  static async testBotConnection() {
    console.log("🤖 Probando conexión del bot...");
    try {
      const bot = TelegramNotifications.getInstance();
      const botInstance = bot.getBot();
      const me = await botInstance.telegram.getMe();
      console.log("✅ Bot conectado:", me.username);
      console.log("📋 ID del bot:", me.id);
      return true;
    } catch (error) {
      console.error("❌ Error de conexión:", error);
      return false;
    }
  }

  // Prueba 2: Enviar notificación de prueba
  static async testNotification(chatId: string) {
    console.log("📢 Probando notificación...");
    try {
      // Usar la clase directamente en lugar del hook
      const vehicleData: VehicleBot = {
        _id: "test-" + Date.now(),
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 15000,
        location: "San José, Costa Rica",
        images: [
          "https://via.placeholder.com/400x300/0066cc/ffffff?text=Toyota+Corolla",
        ],
        features: ["Aire acondicionado", "Transmisión automática", "GPS"],
        ownerTelegramId: chatId,
      };

      await TelegramNotifications.notifyNewVehicle(vehicleData);
      console.log("✅ Notificación enviada correctamente");
      return true;
    } catch (error) {
      console.error("❌ Error enviando notificación:", error);
      return false;
    }
  }

  // Prueba 3: Probar webhook
  static async testWebhook() {
    console.log("🌐 Probando webhook...");
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/telegram/webhook`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "Telegram bot webhook is running") {
        console.log("✅ Webhook funcionando correctamente");
        console.log("📊 Bot:", data.bot);
        console.log("⏰ Timestamp:", data.timestamp);
        return true;
      } else {
        console.error("❌ Webhook no responde correctamente");
        return false;
      }
    } catch (error) {
      console.error("❌ Error probando webhook:", error);
      return false;
    }
  }

  // Prueba 4: Verificar comandos
  static async testCommands() {
    console.log("⚙️ Verificando comandos registrados...");
    try {
      const bot = TelegramNotifications.getInstance();
      const botInstance = bot.getBot();

      const commands = await botInstance.telegram.getMyCommands();
      console.log("📋 Comandos encontrados:", commands.length);

      if (commands.length > 0) {
        console.log("✅ Comandos configurados:");
        commands.forEach((cmd) => {
          console.log(`   /${cmd.command} - ${cmd.description}`);
        });
        return true;
      } else {
        console.log("⚠️ No hay comandos registrados");
        console.log(
          "💡 Esto es normal si es la primera vez que ejecutas el bot"
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error verificando comandos:", error);
      return false;
    }
  }

  // Prueba 5: Verificar variables de entorno
  static testEnvironmentVariables() {
    console.log("🔐 Verificando variables de entorno...");

    const requiredVars = [
      "MONGODB_URI", // Agregado para verificar MongoDB
      "TELEGRAM_BOT_TOKEN",
      "TELEGRAM_BOT_USERNAME", 
      "TELEGRAM_ADMIN_CHAT_IDS",
      "NEXT_PUBLIC_BASE_URL",
    ];

    const missing: string[] = [];
    const found: string[] = [];

    requiredVars.forEach((varName) => {
      if (process.env[varName]) {
        found.push(varName);
      } else {
        missing.push(varName);
      }
    });

    console.log("✅ Variables encontradas:", found.length);
    found.forEach((v) => console.log(`   ${v}: ✓`));

    if (missing.length > 0) {
      console.log("❌ Variables faltantes:", missing.length);
      missing.forEach((v) => console.log(`   ${v}: ✗`));
      return false;
    }

    return true;
  }

  // Ejecutar todas las pruebas
  static async runAllTests(testChatId?: string) {
    console.log("🧪 INICIANDO PRUEBAS DEL BOT DE TELEGRAM");
    console.log("=".repeat(50));

    const results = {
      environment: this.testEnvironmentVariables(),
      connection: false,
      webhook: false,
      commands: false,
      notification: false,
    };

    console.log("");

    // Solo continuar si las variables de entorno están bien
    if (results.environment) {
      results.connection = await this.testBotConnection();
      results.webhook = await this.testWebhook();

      if (results.connection) {
        results.commands = await this.testCommands();

        // Solo probar notificación si tenemos chatId y la conexión funciona
        if (testChatId) {
          console.log(`\n📱 Probando notificación a chat ID: ${testChatId}`);
          results.notification = await this.testNotification(testChatId);
        }
      }
    }

    console.log("\n📊 RESULTADOS FINALES:");
    console.log("=".repeat(30));
    console.log(
      `🔐 Variables de entorno: ${results.environment ? "✅ OK" : "❌ FALTAN"}`
    );
    console.log(
      `🤖 Conexión del bot: ${results.connection ? "✅ OK" : "❌ FALLO"}`
    );
    console.log(`🌐 Webhook: ${results.webhook ? "✅ OK" : "❌ FALLO"}`);
    console.log(
      `⚙️ Comandos: ${results.commands ? "✅ OK" : "⚠️ SIN COMANDOS"}`
    );
    console.log(
      `📢 Notificaciones: ${results.notification ? "✅ OK" : testChatId ? "❌ FALLO" : "⚠️ NO PROBADO"}`
    );

    const totalTests = testChatId ? 5 : 4;
    const passedTests = Object.values(results).filter(Boolean).length;

    console.log(
      `\n🎯 RESULTADO FINAL: ${passedTests}/${totalTests} pruebas exitosas`
    );

    if (passedTests === totalTests) {
      console.log("🎉 ¡TODO FUNCIONANDO PERFECTAMENTE!");
      console.log("🚀 Tu bot está listo para usar");
    } else if (passedTests >= totalTests - 1) {
      console.log("✅ Bot funcionando bien con problemas menores");
    } else {
      console.log("⚠️ Hay algunos problemas que necesitan atención");

      // Sugerencias específicas
      if (!results.environment) {
        console.log("💡 Revisa tu archivo .env.local");
      }
      if (!results.connection) {
        console.log("💡 Verifica tu TELEGRAM_BOT_TOKEN");
      }
      if (!results.webhook) {
        console.log("💡 Asegúrate de que tu servidor esté corriendo");
      }
    }

    return results;
  }

  // Método para probar solo una funcionalidad específica
  static async testSingle(
    testType: TestType,
    chatId?: string
  ) {
    console.log(`🔍 Probando: ${testType.toUpperCase()}`);

    switch (testType) {
      case "connection":
        return await this.testBotConnection();
      case "webhook":
        return await this.testWebhook();
      case "commands":
        return await this.testCommands();
      case "notification":
        if (!chatId) {
          console.error("❌ Se requiere chatId para probar notificaciones");
          return false;
        }
        return await this.testNotification(chatId);
      default:
        console.error("❌ Tipo de prueba no válido");
        return false;
    }
  }
}

// Función principal para exportar
export async function testTelegramBot(chatId?: string) {
  return await BotTester.runAllTests(chatId);
}

// Función para probar una sola funcionalidad
export async function testSingle(
  testType: TestType,
  chatId?: string
) {
  return await BotTester.testSingle(testType, chatId);
}

// Si se ejecuta directamente desde la línea de comandos
if (require.main === module) {
  const chatId = process.argv[2]; // Opcional: node test-telegram-bot.js CHAT_ID
  const testType = process.argv[3] as TestType; // Opcional: node test-telegram-bot.js CHAT_ID connection

  if (testType) {
    testSingle(testType, chatId);
  } else {
    testTelegramBot(chatId);
  }
}

export default BotTester;