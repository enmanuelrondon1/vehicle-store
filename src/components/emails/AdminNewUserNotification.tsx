import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Heading,
} from '@react-email/components';
import * as React from 'react';

interface AdminNewUserNotificationProps {
  userName: string;
  userEmail: string;
  registrationDate: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const AdminNewUserNotification = ({
  userName,
  userEmail,
  registrationDate,
}: AdminNewUserNotificationProps) => (
  <Html>
    <Head />
    <Preview>¡Nuevo usuario registrado en 1auto.market!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="auto"
          alt="1auto.market Logo"
          style={logo}
        />
        <Heading style={heading}>👤 Nuevo Usuario Registrado</Heading>
        <Text style={paragraph}>
          Un nuevo usuario se ha unido a la plataforma. Aquí están sus detalles:
        </Text>
        <Section style={{ padding: '0 24px', borderLeft: '4px solid #007bff', margin: '24px 0' }}>
          <Text style={detailsText}><strong>Nombre:</strong> {userName}</Text>
          <Text style={detailsText}><strong>Email:</strong> {userEmail}</Text>
          <Text style={detailsText}><strong>Fecha de Registro:</strong> {registrationDate}</Text>
        </Section>
        <Section style={{ textAlign: 'center' }}>
          <Button
            style={button}
            href={`${baseUrl}/AdminPanel/users`}
          >
            Ver Lista de Usuarios
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          1auto.market - Panel de Administración
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AdminNewUserNotification;

// (Puedes copiar los estilos de los otros emails, son genéricos y funcionan bien aquí)
const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px', border: '1px solid #f0f0f0', borderRadius: '8px' };
const logo = { margin: '0 auto' };
const heading = { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' as const, color: '#333' };
const paragraph = { fontSize: '16px', lineHeight: '24px', textAlign: 'center' as const, color: '#555', padding: '0 20px' };
const detailsText = { fontSize: '14px', lineHeight: '22px', color: '#555', margin: '4px 0' };
const button = { backgroundColor: '#007bff', borderRadius: '5px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 20px', margin: '20px auto' };
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { color: '#8898aa', fontSize: '12px', lineHeight: '16px', textAlign: 'center' as const };