import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from "@/interfaces/interfaces";

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

export { storeUserSession, getUserSession, storeUserData, getUserData };
