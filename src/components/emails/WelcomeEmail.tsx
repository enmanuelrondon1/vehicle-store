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

interface WelcomeEmailProps {
  userName: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>¡Bienvenido a 1auto.market! Tu aventura automotriz comienza ahora.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="auto"
          alt="1auto.market Logo"
          style={logo}
        />
        <Heading style={heading}>¡Bienvenido a bordo, {userName}!</Heading>
        <Text style={paragraph}>
          Gracias por registrarte en 1auto.market. Estamos emocionados de tenerte con nosotros.
          Ya puedes empezar a explorar vehículos o publicar tu primer anuncio.
        </Text>
        <Section style={{ textAlign: 'center' }}>
          <Button
            className="bg-brand text-white rounded-lg py-3 px-6 font-semibold"
            href={`${baseUrl}/publicar-anuncio`} // <-- CAMBIO AQUÍ
          >
            Publicar tu primer vehículo
          </Button>
        </Section>
        <Text style={paragraph}>
          Si tienes alguna pregunta, no dudes en contactarnos.
          <br />
          — El equipo de 1auto.market
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          1auto.market - Tu mercado de vehículos de confianza.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

// (Puedes copiar los estilos del otro email, son genéricos y funcionan bien aquí)
const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px', border: '1px solid #f0f0f0', borderRadius: '8px' };
const logo = { margin: '0 auto' };
const heading = { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' as const, color: '#333' };
const paragraph = { fontSize: '16px', lineHeight: '24px', textAlign: 'center' as const, color: '#555', padding: '0 20px' };

const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { color: '#8898aa', fontSize: '12px', lineHeight: '16px', textAlign: 'center' as const };