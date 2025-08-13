// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

// Esquema de validación con Zod
const ContactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("El formato del email no es válido."),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres."),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    logger.info("POST /api/contact - Recibido:", body);

    // Validar los datos
    const validationResult = ContactSchema.safeParse(body);

    if (!validationResult.success) {
      logger.error(
        "Errores de validación:",
        validationResult.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Verificar que tengamos el Access Key
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;
    if (!accessKey || !recipientEmail) {
      const missingVars = [];
      if (!accessKey) {
        missingVars.push("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY");
      }
      if (!recipientEmail) {
        missingVars.push("CONTACT_RECIPIENT_EMAIL");
      }
      const errorMessage = `Error de configuración: Faltan las siguientes variables de entorno: ${missingVars.join(
        ", "
      )}`;
      logger.error(errorMessage);
      return NextResponse.json(
        { success: false, error: "Error de configuración del servidor." },
        { status: 500 }
      );
    }

    // Preparar datos para Web3Forms
    const web3FormsData = {
      access_key: accessKey,
      name: name,
      email: email,
      subject: `[1AutoMarket] ${subject}`,
      message: `
Nombre: ${name}
Email: ${email}
Asunto: ${subject}

Mensaje:
${message}

---
Enviado desde: https://1auto.market
Fecha: ${new Date().toLocaleString("es-ES", { timeZone: "America/Caracas" })}
      `.trim(),
      from_name: "1AutoMarket - Formulario de Contacto",
      to_email: recipientEmail,
    };

    logger.info("Enviando a Web3Forms...");

    // Enviar a Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(web3FormsData),
    });

    const result = await response.json();
    logger.info("Respuesta de Web3Forms:", result);

    if (!response.ok) {
      throw new Error(
        result.message || "Error al enviar el mensaje a Web3Forms"
      );
    }

    if (!result.success) {
      throw new Error(result.message || "Web3Forms reportó un error");
    }

    logger.info("Email enviado exitosamente con Web3Forms");

    return NextResponse.json(
      { success: true, message: "Mensaje enviado correctamente." },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error en POST /api/contact:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json(
      { success: false, error: `Error al enviar el mensaje: ${errorMessage}` },
      { status: 500 }
    );
  }
}
