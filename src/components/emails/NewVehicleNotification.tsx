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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { VehicleDataFrontend } from '@/types/types';

interface NewVehicleNotificationEmailProps {
  vehicle: VehicleDataFrontend;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const NewVehicleNotificationEmail = ({
  vehicle,
}: NewVehicleNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nuevo anuncio de vehículo pendiente de aprobación: {vehicle.brand} {vehicle.model}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`${baseUrl}/logo.png`}
          width="150"
          height="auto"
          alt="1auto.market Logo"
          style={logo}
        />
        <Heading style={heading}>Nuevo Anuncio Recibido</Heading>
        <Text style={paragraph}>
          Se ha recibido un nuevo anuncio de vehículo y está pendiente de tu revisión y aprobación.
        </Text>
        
        <Section style={vehicleInfoBox}>
          <Row>
            <Column>
              <Img
                src={vehicle.images[0] || `${baseUrl}/placeholder.svg`}
                width="120"
                height="90"
                alt="Vehículo"
                style={vehicleImage}
              />
            </Column>
            <Column style={{ paddingLeft: '20px' }}>
              <Text style={vehicleTitle}>{vehicle.brand} {vehicle.model} {vehicle.year}</Text>
              <Text style={vehiclePrice}>
                ${vehicle.price.toLocaleString('es-VE')} USD
              </Text>
              <Text style={vehicleMileage}>{vehicle.mileage.toLocaleString('es-VE')} km</Text>
            </Column>
          </Row>
        </Section>

        <Section>
          <Heading as="h2" style={subHeading}>Detalles del Vendedor</Heading>
          <Text style={detailsText}><strong>Nombre:</strong> {vehicle.sellerContact.name}</Text>
          <Text style={detailsText}><strong>Email:</strong> {vehicle.sellerContact.email}</Text>
          <Text style={detailsText}><strong>Teléfono:</strong> {vehicle.sellerContact.phone}</Text>
        </Section>
        
        <Hr style={hr} />

        <Section style={{ textAlign: 'center' }}>
          <Text style={paragraph}>
            Por favor, revisa el anuncio en el panel de administración para aprobarlo o rechazarlo.
          </Text>
          <Button
            style={button}
            href={`${baseUrl}/admin/vehicles/${vehicle._id}`}
          >
            Revisar Anuncio
          </Button>
        </Section>
        
        <Hr style={hr} />
        <Text style={footer}>
          1auto.market - Tu mercado de vehículos de confianza.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewVehicleNotificationEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#333',
};

const subHeading = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginTop: '24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center' as const,
  color: '#555',
  padding: '0 20px',
};

const vehicleInfoBox = {
  padding: '20px',
  margin: '20px',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
};

const vehicleImage = {
  borderRadius: '4px',
  objectFit: 'cover' as const,
};

const vehicleTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 5px 0',
  color: '#212529',
};

const vehiclePrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#28a745',
  margin: '0 0 5px 0',
};

const vehicleMileage = {
  fontSize: '14px',
  color: '#6c757d',
  margin: 0,
};

const detailsText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#555',
  margin: '4px 0',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
  margin: '20px auto',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};