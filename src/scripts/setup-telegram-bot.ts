// src/scripts/setup-telegram-bot.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import TelegramBot from '@/lib/telegram-bot';

interface SetupConfig {
  webhookUrl: string;
  adminChatIds: string[];
}

class TelegramBotSetup {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot();
  }

  async setupWebhook(config: SetupConfig) {
    try {
      const webhookUrl = `${config.webhookUrl}/api/telegram/webhook`;
      
      console.log('🔧 Configurando webhook de Telegram...');
      console.log('📍 URL del webhook:', webhookUrl);
      
      // Configurar webhook usando la API HTTP (más confiable)
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      if (!BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN no está configurado');
      }

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query', 'inline_query'],
          drop_pending_updates: true
        }),
      });
      
      const result = await response.json();
      
      if (result.ok) {
        console.log('✅ Webhook configurado exitosamente');
        console.log('📋 Descripción:', result.description);
      } else {
        console.error('❌ Error configurando webhook:', result.description);
        throw new Error(`Error configurando webhook: ${result.description}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Error en setup del webhook:', error);
      throw error;
    }
  }

  async getBotInfo() {
    try {
      const me = await this.bot.getBot().telegram.getMe();
      console.log('🤖 Información del bot:');
      console.log(`   Nombre: ${me.first_name}`);
      console.log(`   Usuario: @${me.username}`);
      console.log(`   ID: ${me.id}`);
      console.log(`   Puede unirse a grupos: ${me.can_join_groups}`);
      console.log(`   Puede leer todos los mensajes: ${me.can_read_all_group_messages}`);
      console.log(`   Soporta inline queries: ${me.supports_inline_queries}`);
      return me;
    } catch (error) {
      console.error('❌ Error obteniendo info del bot:', error);
      throw error;
    }
  }

  async getWebhookInfo() {
    try {
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      if (!BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN no está configurado');
      }

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
      const webhookInfo = await response.json();
      
      if (webhookInfo.ok) {
        console.log('🔗 Configuración actual del webhook:');
        console.log(`   URL: ${webhookInfo.result.url || 'No configurado'}`);
        console.log(`   Pendientes: ${webhookInfo.result.pending_update_count}`);
        console.log(`   Último error: ${webhookInfo.result.last_error_message || 'Ninguno'}`);
        console.log(`   Fecha último error: ${webhookInfo.result.last_error_date ? new Date(webhookInfo.result.last_error_date * 1000) : 'N/A'}`);
        console.log(`   Max conexiones: ${webhookInfo.result.max_connections}`);
        console.log(`   IP permitida: ${webhookInfo.result.ip_address || 'Cualquiera'}`);
      }
      
      return webhookInfo.result;
    } catch (error) {
      console.error('❌ Error obteniendo info del webhook:', error);
      throw error;
    }
  }

  async setCommands() {
    try {
      const commands = [
        { command: 'start', description: 'Iniciar el bot' },
        { command: 'help', description: 'Mostrar ayuda' },
        { command: 'buscar', description: 'Buscar vehículos' },
        { command: 'notificaciones', description: 'Configurar alertas' },
        { command: 'estadisticas', description: 'Ver estadísticas del mercado' },
        { command: 'contacto', description: 'Información de contacto' },
        { command: 'web', description: 'Ir a la página web' },
        { command: 'perfil', description: 'Ver tu perfil' }
      ];

      await this.bot.getBot().telegram.setMyCommands(commands);
      console.log('📋 Comandos del bot configurados');
      return commands;
    } catch (error) {
      console.error('❌ Error configurando comandos:', error);
      throw error;
    }
  }

  async sendTestMessage(chatId: string) {
    try {
      const testMessage = `🧪 **Mensaje de prueba - Bot configurado correctamente!**

✅ Bot funcionando
🔗 Webhook activo
📋 Comandos configurados

**Prueba estos comandos:**
/help - Ver ayuda
/buscar - Buscar vehículos
/web - Visitar AutoMarket

🎉 ¡Todo listo para usar!`;

      await this.bot.getBot().telegram.sendMessage(
        chatId, 
        testMessage,
        { 
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌐 Visitar AutoMarket', url: 'https://1auto.market' }]
            ]
          }
        }
      );
      console.log('✅ Mensaje de prueba enviado');
    } catch (error) {
      console.error('❌ Error enviando mensaje de prueba:', error);
      throw error;
    }
  }

  async removeWebhook() {
    try {
      const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      if (!BOT_TOKEN) {
        throw new Error('TELEGRAM_BOT_TOKEN no está configurado');
      }

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          drop_pending_updates: true
        }),
      });
      
      const result = await response.json();
      console.log('🗑️ Webhook eliminado:', result.ok);
      return result;
    } catch (error) {
      console.error('❌ Error eliminando webhook:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🔍 Probando conexión con Telegram...');
      
      // Test básico de conexión
      await this.getBotInfo();
      
      // Test webhook info
      await this.getWebhookInfo();
      
      console.log('✅ Conexión exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error en test de conexión:', error);
      return false;
    }
  }
}

// Script de configuración
async function main() {
  console.log('🚀 Iniciando configuración del bot de Telegram...\n');

  const setup = new TelegramBotSetup();

  try {
    // 1. Test de conexión inicial
    console.log('Step 1: Testing connection...');
    const connected = await setup.testConnection();
    if (!connected) {
      throw new Error('No se pudo conectar con la API de Telegram');
    }
    console.log('');

    // 2. Configurar comandos del bot
    console.log('Step 2: Setting up bot commands...');
    await setup.setCommands();
    console.log('');

    // 3. Configurar webhook
    console.log('Step 3: Setting up webhook...');
    const config: SetupConfig = {
      webhookUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://1auto.market',
      adminChatIds: process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(',') || []
    };

    if (config.webhookUrl.includes('localhost')) {
      console.log('⚠️  ADVERTENCIA: Estás configurando webhook para localhost.');
      console.log('   Esto no funcionará en producción. Usa tu dominio real.');
    }

    await setup.setupWebhook(config);
    console.log('');

    // 4. Verificar configuración final
    console.log('Step 4: Verifying final configuration...');
    await setup.getWebhookInfo();
    console.log('');

    // 5. Enviar mensaje de prueba (opcional)
    if (config.adminChatIds.length > 0) {
      console.log('Step 5: Sending test messages...');
      for (const chatId of config.adminChatIds) {
        if (chatId.trim()) {
          try {
            await setup.sendTestMessage(chatId.trim());
          } catch (error) {
            console.error(`❌ Error enviando mensaje a ${chatId}:`, error);
          }
        }
      }
    } else {
      console.log('⚠️  No hay chat IDs de admin configurados. Saltando mensajes de prueba.');
    }

    console.log('\n🎉 ¡Bot configurado exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Asegúrate de que tu aplicación esté deployada');
    console.log('   2. Prueba el bot enviando /start');
    console.log('   3. Verifica que los comandos funcionen');
    console.log('   4. Configura las notificaciones en tu aplicación');
    
  } catch (error) {
    console.error('\n💥 Error en la configuración:', error);
    console.log('\n🔧 Para solucionar problemas:');
    console.log('   1. Verifica que TELEGRAM_BOT_TOKEN esté configurado');
    console.log('   2. Asegúrate de que la URL del webhook sea accesible');
    console.log('   3. Revisa que no haya errores en los logs');
    process.exit(1);
  }
}

// Función para eliminar webhook (útil para desarrollo)
async function deleteWebhook() {
  console.log('🗑️  Eliminando webhook...');
  
  const setup = new TelegramBotSetup();
  
  try {
    await setup.removeWebhook();
    console.log('✅ Webhook eliminado. El bot ahora puede usar polling para desarrollo local.');
  } catch (error) {
    console.error('❌ Error eliminando webhook:', error);
  }
}

// Ejecutar según argumentos de línea de comandos
const command = process.argv[2];

if (command === 'delete' || command === 'remove') {
  deleteWebhook();
} else if (command === 'test') {
  const setup = new TelegramBotSetup();
  setup.testConnection();
} else {
  main();
}

export default TelegramBotSetup;