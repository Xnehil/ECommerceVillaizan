import React, { useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons'; // Asegúrate de tener FontAwesome instalado
import TabBarIcon from '@/components/StyledIcon';
import { useRoute } from "@react-navigation/native";

const DeliverySuccessScreen = () => {

  useEffect(() => {
    // Bloquea el botón físico de retroceso
    const blockBackPress = () => true; // Retorna true para deshabilitar retroceso
    BackHandler.addEventListener('hardwareBackPress', blockBackPress);

    // Redirige después de 3 segundos
    const timer = setTimeout(() => {
      router.replace({
        pathname: "/home/delivery",
      });
    }, 3000);

    // Limpieza: elimina el listener y el timeout si el componente se desmonta
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', blockBackPress);
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Entrega reasginada!</Text>
      <TabBarIcon 
        name="check-circle" 
        color="black" 
        IconComponent={FontAwesome} 
        size={80} // Tamaño grande para que se vea bien
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Fondo blanco como en la imagen
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default DeliverySuccessScreen;
