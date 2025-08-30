// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import TelegramBot from "@/lib/telegram-bot";

let bot: TelegramBot | null = null;

// Inicializa el bot como un singleton para evitar crear múltiples instancias.
function getBot() {
  if (!bot) {
    bot = new TelegramBot();
    bot.start(); // Inicia el bot (si `launch` está en un método `start`)
  }
  return bot;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar que es una actualización válida de Telegram
    if (!body.update_id) {
      console.warn("Webhook received a request without an update_id, ignoring.");
      return NextResponse.json({ ok: true });
    }

    const telegramBot = getBot();

    // Pasar la actualización a la instancia de Telegraf para que la procese
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