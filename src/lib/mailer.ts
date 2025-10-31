// src/lib/mailer.ts
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { VehicleDataFrontend } from '@/types/types';
import { logger } from './logger';
import NewVehicleNotificationEmail from '@/components/emails/NewVehicleNotification';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import AdminNewUserNotification from '@/components/emails/AdminNewUserNotification';
import VehicleRejectionEmail from '@/components/emails/VehicleRejectionEmail';
import VehicleApprovalEmail from '@/components/emails/VehicleApprovalEmail';
import ResetPasswordEmail from '@/components/emails/ResetPasswordEmail';
import React from 'react';
import { renderAsync } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || "";

// Configurar transportador de Gmail para rechazos
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export async function sendNewVehicleNotificationEmail(vehicle: VehicleDataFrontend) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY no está configurada. Saltando envío de email.');
    return;
  }

  if (!recipientEmail) {
    logger.warn('CONTACT_RECIPIENT_EMAIL no está configurado. No se puede enviar email.');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `1auto.market <${fromEmail}>`,
      to: [recipientEmail],
      subject: `🚀 Nuevo Anuncio: ${vehicle.brand} ${vehicle.model}`,
      react: NewVehicleNotificationEmail({ vehicle }),
      text: `Nuevo vehículo publicado: ${vehicle.brand} ${vehicle.model}. Precio: ${vehicle.price}.`,
    });

    if (error) {
      logger.error('Error al enviar email con Resend:', error);
      throw new Error(error.message);
    }

    logger.info('Email de notificación enviado exitosamente:', data);
    return data;
  } catch (error) {
    logger.error('Fallo la función sendNewVehicleNotificationEmail:', error);
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  if (!process.env.RESEND_API_KEY) {
    logger.warn('RESEND_API_KEY no está configurada. Saltando envío de email de bienvenida.');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `1auto.market <${fromEmail}>`,
      to: [userEmail],
      subject: `🎉 ¡Bienvenido a 1auto.market, ${userName}!`,
      react: WelcomeEmail({ userName }),
      text: `¡Hola ${userName}! Bienvenido a 1auto.market.`,
    });

    if (error) {
      logger.error('Error al enviar email de bienvenida con Resend:', error);
      throw new Error(error.message);
    }

    logger.info('Email de bienvenida enviado exitosamente a:', userEmail, data);
    return data;
  } catch (error) {
    logger.error('Fallo la función sendWelcomeEmail:', error);
  }
}

export async function sendAdminNewUserNotification(userEmail: string, userName: string) {
  if (!process.env.RESEND_API_KEY || !recipientEmail) {
    logger.warn('No se puede enviar email de notificación de admin. Faltan RESEND_API_KEY o CONTACT_RECIPIENT_EMAIL.');
    return;
  }

  try {
    const registrationDate = new Date().toLocaleString('es-VE', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const { data, error } = await resend.emails.send({
      from: `Notificaciones 1auto.market <${fromEmail}>`,
      to: [recipientEmail],
      subject: `👤 Nuevo Usuario Registrado: ${userName}`,
      react: AdminNewUserNotification({ userName, userEmail, registrationDate }),
      text: `Nuevo usuario registrado: ${userName} (${userEmail}) el ${registrationDate}.`,
    });

    if (error) {
      logger.error('Error al enviar email de notificación de admin con Resend:', error);
      throw new Error(error.message);
    }

    logger.info('Email de notificación de admin enviado exitosamente para:', userEmail, data);
    return data;
  } catch (error) {
    logger.error('Fallo la función sendAdminNewUserNotification:', error);
  }
}

export async function sendVehicleApprovalEmail(vehicle: VehicleDataFrontend) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    logger.warn(
      'GMAIL_USER o GMAIL_PASSWORD no están configurados. Saltando envío de email de aprobación.'
    );
    return;
  }

  const toEmail = vehicle.sellerContact?.email;
  const userName = vehicle.sellerContact?.name || 'Vendedor';
  const vehicleTitle = `${vehicle.brand} ${vehicle.model}`;
  const vehicleUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicle._id}`;

  if (!toEmail) {
    logger.warn(
      'No se encontró el email del vendedor para el vehículo:',
      vehicle._id
    );
    return;
  }

  try {
    const emailHtml = await renderAsync(
      React.createElement(VehicleApprovalEmail, {
        userName,
        vehicleTitle,
        vehicleUrl,
      })
    );

    await gmailTransporter.sendMail({
      from: `1auto.market <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `✅ ¡Tu anuncio "${vehicleTitle}" ha sido aprobado!`,
      html: emailHtml,
    });

    logger.info(`Email de aprobación enviado exitosamente a: ${toEmail}`);
    return { success: true, email: toEmail };
  } catch (error) {
    logger.error('Fallo la función sendVehicleApprovalEmail:', error);
    throw error;
  }
}

export async function sendVehicleRejectionEmailGmail(
  vehicle: VehicleDataFrontend,
  rejectionReason: string
) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    logger.warn('GMAIL_USER o GMAIL_PASSWORD no están configurados. Saltando envío de email de rechazo.');
    return;
  }

  const toEmail = vehicle.sellerContact?.email;
  const userName = vehicle.sellerContact?.name || 'Vendedor';
  const vehicleTitle = `${vehicle.brand} ${vehicle.model}`;

  if (!toEmail) {
    logger.warn('No se encontró el email del vendedor para el vehículo:', vehicle._id);
    return;
  }

  try {
    // Renderizar el componente React a HTML
    const emailHtml = await renderAsync(
      React.createElement(VehicleRejectionEmail, {
        userName,
        vehicleTitle,
        rejectionReason,
      })
    );

    await gmailTransporter.sendMail({
      from: `1auto.market <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Tu anuncio "${vehicleTitle}" no fue aprobado`,
      html: emailHtml,
    });

    logger.info(`Email de rechazo enviado exitosamente a: ${toEmail}`);
    return { success: true, email: toEmail };
  } catch (error) {
    logger.error('Fallo la función sendVehicleRejectionEmailGmail:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  resetUrl: string
) {
  if (process.env.NODE_ENV === "production") {
    // --- Lógica de producción con Resend ---
    if (!process.env.RESEND_API_KEY) {
      logger.error(
        "RESEND_API_KEY no está configurada. No se puede enviar el correo de reseteo de contraseña en producción."
      );
      throw new Error(
        "El servidor no está configurado para enviar correos."
      );
    }
    try {
      const { data, error } = await resend.emails.send({
        from: `Soporte 1auto.market <${fromEmail}>`,
        to: [userEmail],
        subject: 'Restablece tu contraseña en 1auto.market',
        react: ResetPasswordEmail({ userName, resetLink: resetUrl }),
        text: `Hola ${userName}, haz clic aquí para restablecer tu contraseña: ${resetUrl}`,
      });

      if (error) {
        logger.error('Error al enviar email de reseteo de contraseña con Resend:', error);
        throw new Error(error.message);
      }
      logger.info('Email de reseteo de contraseña enviado con Resend:', data);
      return data;
    } catch (error) {
      logger.error('Fallo la función sendPasswordResetEmail en producción:', error);
      throw error;
    }
  } else {
    // --- Lógica de desarrollo con Nodemailer + Ethereal ---
    try {
      // Crea una cuenta de prueba de Ethereal
      const testAccount = await nodemailer.createTestAccount();

      // Crea un transportador reutilizable usando los datos de Ethereal
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // usuario generado por Ethereal
          pass: testAccount.pass, // contraseña generada por Ethereal
        },
      });

      const mailOptions = {
        from: '"Soporte 1auto.market" <noreply@1auto.market>',
        to: userEmail, // El correo del usuario que solicita el reseteo
        subject: 'Restablece tu contraseña en 1auto.market',
        text: `Hola ${userName}, haz clic aquí para restablecer tu contraseña: ${resetUrl}`,
        html: `<p>Hola ${userName},</p><p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`,
      };

      const info = await transporter.sendMail(mailOptions);

      logger.info('Correo de desarrollo enviado: %s', info.messageId);
      // La URL para previsualizar el correo se mostrará en la consola
      logger.info('URL de previsualización: %s', nodemailer.getTestMessageUrl(info));

      return {
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    } catch (error) {
      logger.error('Fallo la función sendPasswordResetEmail en desarrollo:', error);
      throw error;
    }
  }
}