
// src/lib/mailer.ts
import { Resend } from 'resend';
import { VehicleDataFrontend } from '@/types/types';
import { logger } from './logger';
import NewVehicleNotificationEmail from '@/components/emails/NewVehicleNotification';
import WelcomeEmail from '@/components/emails/WelcomeEmail';
import AdminNewUserNotification from '@/components/emails/AdminNewUserNotification';


const resend = new Resend(process.env.RESEND_API_KEY);
const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

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
      to: [userEmail], // Se envía solo al nuevo usuario
      subject: `🎉 ¡Bienvenido a 1auto.market, ${userName}!`,
      react: WelcomeEmail({ userName }),
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
      to: [recipientEmail], // Se envía solo a ti
      subject: `👤 Nuevo Usuario Registrado: ${userName}`,
      react: AdminNewUserNotification({ userName, userEmail, registrationDate }),
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
