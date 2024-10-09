"use client";

import React, { useState, useEffect } from 'react';

// Definimos los props para el componente Toaster
interface ToasterProps {
  message: string;
  backgroundColor: string;
}

const Toaster: React.FC<ToasterProps> = ({ message, backgroundColor }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Configuramos un temporizador para ocultar el toaster después de 20 segundos
    const timer = setTimeout(() => {
      setVisible(false);
    }, 20000);

    // Limpiamos el temporizador cuando el componente se desmonta
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor,
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    }}>
      {message}
    </div>
  );
};

export default Toaster;
