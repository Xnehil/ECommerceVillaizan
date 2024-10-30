import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedido, Usuario } from "@/interfaces/interfaces";

// Guardar la sesión
const storeUserSession = async (token: string) => {
  try {
    await AsyncStorage.setItem('@user_token', token);
  } catch (e) {
    console.error('Error saving user session', e);
  }
};

// Obtener la sesión guardada
const getUserSession = async () => {
  try {
    const token = await AsyncStorage.getItem('@user_token');
    if (token !== null) {
      console.log('Token:', token);
    }
  } catch (e) {
    console.error('Error retrieving session', e);
  }
};

const storeUserData = async (data: Usuario) => {
  try {
    await AsyncStorage.setItem('@user_data', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving user data', e);
  }
};

// Obtener la data guardada
const getUserData = async (): Promise<Usuario | null> => {
  try {
    const data = await AsyncStorage.getItem('@user_data');
    if (data !== null) {
      return JSON.parse(data) as Usuario;
    }
    return null;
  } catch (e) {
    console.error('Error retrieving user data', e);
    return null;
  }
};



const storeCurrentDelivery = async (delivery: Pedido) => {
  try {
    await AsyncStorage.setItem('@current_delivery', JSON.stringify(delivery));
  } catch (e) {
    console.error('Error saving current delivery', e);
  }
};

const getCurrentDelivery = async (): Promise<Pedido | null> => {
  try {
    const delivery = await AsyncStorage.getItem('@current_delivery');
    if (delivery !== null) {
      return JSON.parse(delivery) as Pedido;
    }
    return null;
  } catch (e) {
    console.error('Error retrieving current delivery', e);
    return null;
  }
};


export { storeUserSession, getUserSession, storeUserData, getUserData, getCurrentDelivery,  storeCurrentDelivery};
import { Motorizado } from "@/interfaces/interfaces";

const storeMotorizadoData = async (data: Motorizado) => {
  try {
    await AsyncStorage.setItem('@motorizado_data', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving motorizado data', e);
  }
};

const getMotorizadoData = async (): Promise<Motorizado | null> => {
  try {
    const data = await AsyncStorage.getItem('@motorizado_data');
    if (data !== null) {
      return JSON.parse(data) as Motorizado;
    }
    return null;
  } catch (e) {
    console.error('Error retrieving motorizado data', e);
    return null;
  }
};

export { storeMotorizadoData, getMotorizadoData };