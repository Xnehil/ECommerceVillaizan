import React from 'react';

type TabBarIconProps = {
  // Componente de ícono (Ionicons, FontAwesome, AntDesign, etc.)
  IconComponent: React.ComponentType<React.ComponentProps<any>>;
  // Nombre del ícono específico que se desea usar
  name: string;
  // Color del ícono
  color: string;
  // Tamaño del ícono (opcional, con un valor predeterminado)
  size?: number;
  // Estilo adicional para el ícono (opcional)
  style?: object;
};

const TabBarIcon = ({ IconComponent, name, color, size = 28, style }: TabBarIconProps) => {
  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={[{ marginBottom: -3 }, style]} // Combina el estilo predeterminado con el personalizado
    />
  );
};

export default TabBarIcon;
