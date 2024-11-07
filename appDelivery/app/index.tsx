import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { UsuarioResponse, UsuariosResponse } from "@/interfaces/interfaces";
import { router } from "expo-router";
import { getUserData, storeUserData } from "@/functions/storage";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "318557549727-378u1l1b1lnpmkctri9mgr32pedn95r7.apps.googleusercontent.com",
    webClientId:
      "318557549727-2nekdr1vo10pm18nslbmh46l8n3ccorq.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log(response.authentication, authentication);
    }
  }, [response]);

  async function credentialLogIn() {
    setLoading(true);
    try {
      const response = await axios.get<UsuarioResponse>(
        `${BASE_URL}/usuario/${username}?esCorreo=true`
      );
      console.log("Response:", response);
      // Extrae el primer motorizado
      const repartidor = response.data.usuario 
      let userFound = false;

      if (username === repartidor.correo) {
        setUsername("");
        setPassword("");
        storeUserData(repartidor);
        // console.log("Usuario encontrado:", repartidor);
        router.push({
          pathname: "/home",
        });
        userFound = true;
      }
      
      if (!userFound) {
        alert('No se encontró su usuario');
      }
    } catch (error) {
      console.error("Error al obtener motorizado:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" onPress={credentialLogIn} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Iniciar Sesión con Google"
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
