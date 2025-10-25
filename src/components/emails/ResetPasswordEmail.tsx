// src/components/emails/ResetPasswordEmail.tsx
import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Img,
  Hr,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  userName: string;
  resetLink: string;
}

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  userName,
  resetLink,
}) => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #ddd',
  };

  const mainStyle = {
    backgroundColor: '#ffffff',
    padding: '30px 20px',
  };

  const footerStyle = {
    marginTop: '20px',
    textAlign: 'center' as const,
    color: '#888',
    fontSize: '12px',
  };

  return (
    <Html>
      <Head />
      <Body style={containerStyle}>
        <Container>
          <Section style={headerStyle}>
            <Img
              src="https://res.cloudinary.com/dnpwz3d2x/image/upload/v1717889618/1auto/logo-1auto-market-orizontal-dark_k1fyls.png"
              alt="1auto.market Logo"
              width="200"
            />
          </Section>

          <Section style={mainStyle}>
            <Heading>Hola, {userName}</Heading>
            <Text>
              Hemos recibido una solicitud para restablecer la contraseña de tu
              cuenta en 1auto.market.
            </Text>
            <Text>
              Para continuar, haz clic en el siguiente botón. Si no has
              solicitado esto, puedes ignorar este correo.
            </Text>
            <Button href={resetLink} style={{ backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', padding: '12px 20px' }}>
              Restablecer Contraseña
            </Button>
            <Hr style={{ margin: '30px 0' }} />
            <Text style={{ fontSize: '12px', color: '#888' }}>
              Si el botón no funciona, copia y pega el siguiente enlace en tu
              navegador:
            </Text>
            <Text style={{ fontSize: '12px', color: '#888', wordBreak: 'break-all' }}>
              {resetLink}
            </Text>
          </Section>

          <Section style={footerStyle}>
            <Text>
              © {new Date().getFullYear()} 1auto.market. Todos los derechos
              reservados.
            </Text>
            <Text>
              Si tienes alguna pregunta, no dudes en contactarnos.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;