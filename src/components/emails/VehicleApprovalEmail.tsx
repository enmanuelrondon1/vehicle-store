import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
} from '@react-email/components';

interface VehicleApprovalEmailProps {
  userName: string;
  vehicleTitle: string;
  vehicleUrl: string;
}

const logoUrl =
  "https://res.cloudinary.com/dcdawwvx2/image/upload/v1760032511/photo_2025-10-09_13-50-37_w0w9cr.jpg";

const VehicleApprovalEmail: React.FC<VehicleApprovalEmailProps> = ({
  userName,
  vehicleTitle,
  vehicleUrl,
}) => (
  <Html>
    <Head />
    <Preview>¡Tu anuncio ha sido aprobado y ya está visible para todos!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={logoUrl}
          width="150"
          height="45"
          alt="1auto.market"
          style={logo}
        />
        <Heading style={heading}>¡Felicidades, {userName}!</Heading>
        <Section style={contentSection}>
          <Text style={paragraph}>
            Tenemos excelentes noticias. Tu anuncio para el vehículo:
          </Text>
          <Text style={vehicleTitleStyle}>&ldquo;{vehicleTitle}&rdquo;</Text>
          <Text style={paragraph}>
            ha sido revisado y aprobado por nuestro equipo. Ya está publicado y visible
            para miles de compradores potenciales en nuestra plataforma.
          </Text>
          <Text style={paragraph}>
            Puedes ver tu anuncio en el siguiente enlace:
          </Text>
          <Link href={vehicleUrl} style={button}>
            Ver mi Anuncio
          </Link>
          <Text style={paragraph}>
            Te deseamos mucho éxito con tu venta. Si tienes alguna pregunta, no
            dudes en contactarnos.
          </Text>
          <Text style={paragraph}>
            Atentamente,
            <br />
            El equipo de 1auto.market
          </Text>
        </Section>
        <Text style={footer}>
          1auto.market - Compra y venta de vehículos en Venezuela.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VehicleApprovalEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  textAlign: 'center' as const,
  color: '#2c3e50',
};

const contentSection = {
  padding: '0 40px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#34495e',
};

const vehicleTitleStyle = {
  ...paragraph,
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const button = {
  backgroundColor: '#27ae60',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};