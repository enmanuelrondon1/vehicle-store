// src/components/emails/VehicleRejectionEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VehicleRejectionEmailProps {
  userName: string;
  vehicleTitle: string;
  rejectionReason: string;
  adminName?: string;
}

const logoUrl =
  "https://res.cloudinary.com/dcdawwvx2/image/upload/v1760032511/photo_2025-10-09_13-50-37_w0w9cr.jpg";

export const VehicleRejectionEmail: React.FC<VehicleRejectionEmailProps> = ({
  userName,
  vehicleTitle,
  rejectionReason,
}

) => (
  <Html>
    <Head />
    <Preview>Tu anuncio en 1auto.market no fue aprobado</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={logoUrl}
          width="150"
          height="45"
          alt="1auto.market"
          style={logo}
        />
        <Text style={paragraph}>Hola {userName},</Text>
        <Text style={paragraph}>
          Lamentamos informarte que tu anuncio para el vehículo &quot;
          {vehicleTitle}&quot; no ha sido aprobado para su publicación en
          1auto.market.
        </Text>
        <Section style={reasonSection}>
          <Heading as="h2" style={reasonHeading}>
            Motivo del rechazo:
          </Heading>
          <Text style={reasonText}>&quot;{rejectionReason}&quot;</Text>
        </Section>
        <Text style={paragraph}>
          Por favor, revisa nuestras políticas de publicación y realiza los
          ajustes necesarios. Puedes editar tu anuncio desde tu panel de usuario
          y volver a enviarlo para revisión.
        </Text>
        <Text style={paragraph}>
          Si tienes alguna pregunta, no dudes en contactarnos.
        </Text>
        <Text style={paragraph}>
          Atentamente,
          <br />
          El equipo de 1auto.market
        </Text>
        <Hr style={hr} />
        <Text style={footer}>1auto.market, tu concesionario de confianza.</Text>
      </Container>
    </Body>
  </Html>
);

export default VehicleRejectionEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const reasonSection = {
  backgroundColor: "#f2f3f3",
  border: "1px solid #e5e5e5",
  borderRadius: "4px",
  padding: "20px",
  margin: "20px 0",
};

const reasonHeading = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  marginTop: "0",
};

const reasonText = {
  fontSize: "16px",
  lineHeight: "24px",
  fontStyle: "italic" as const,
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
