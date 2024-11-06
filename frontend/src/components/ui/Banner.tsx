import React from 'react';

interface BannerProps {
  minOrderAmount?: number;
  startTime?: string;
  endTime?: string;
}

const Banner: React.FC<BannerProps> = ({ minOrderAmount, startTime, endTime }) => {
  const hasDeliveryInfo = minOrderAmount !== undefined && startTime && endTime;
  const message = hasDeliveryInfo
    ? `El monto mínimo de tu pedido debe ser S/ ${minOrderAmount}. El horario de atención de hoy es de ${startTime} a ${endTime}.`
    : "La información de entrega no está disponible en este momento. La información se actualizará pronto. Por favor, intenta nuevamente más tarde.";

  return (
    <div style={bannerStyle}>
      <p style={textStyle}>
        {hasDeliveryInfo ? "📦" : "⚠️"} {message}
      </p>
    </div>
  );
};

const bannerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #fdfdfd, #f7f7f7)', // subtle gradient
  padding: '15px 20px',
  textAlign: 'center',
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // soft shadow
  borderRadius: '8px', // rounded corners for a modern look
  margin: '10px 0', // spacing between header and content
};

const textStyle: React.CSSProperties = {
  color: '#333',
  fontSize: '18px',
  fontWeight: '500',
  margin: '0',
  lineHeight: '1.5',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)', // slight text shadow
};

export default Banner;
