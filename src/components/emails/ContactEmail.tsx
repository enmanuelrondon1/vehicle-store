// src/components/emails/ContactEmail.tsx
import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Container,
  Text,
  Section,
  Preview,
  Hr,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmail: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <Html>
    <Head />
    <Preview>Nuevo mensaje de contacto de {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nuevo Mensaje de Contacto</Heading>
        <Text style={paragraph}>
          Has recibido un nuevo mensaje a través del formulario de contacto de
          tu sitio web.
        </Text>
        <Hr style={hr} />
        <Section>
          <Text style={label}>De:</Text>
          <Text style={value}>{name}</Text>
          <Text style={label}>Email del remitente:</Text>
          <Text style={value}>{email}</Text>
          <Text style={label}>Asunto:</Text>
          <Text style={value}>{subject}</Text>
          <Text style={label}>Mensaje:</Text>
          <Text style={messageBox}>{message}</Text>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Este mensaje fue enviado desde 1auto-market.com
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  color: "#484848",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#5f5f5f",
  padding: "0 20px",
};

const label = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#484848",
  padding: "0 20px",
  marginBottom: "2px",
};

const value = {
  fontSize: "16px",
  color: "#5f5f5f",
  padding: "0 20px",
  marginTop: "0px",
};

const messageBox = {
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  padding: "15px",
  margin: "0 20px",
  fontSize: "16px",
  lineHeight: "24px",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#fafafa",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};

export default ContactEmail;
