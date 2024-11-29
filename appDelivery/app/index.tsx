import React, { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import { UsuarioResponse, UsuariosResponse } from "@/interfaces/interfaces";
import { router } from "expo-router";
import { getUserData, storeUserData } from "@/functions/storage";
import { Platform } from "react-native";

let BASE_URL = '';
if (Platform.OS === "web") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
}
else if(Platform.OS === "android") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_MOVIL || process.env.EXPO_PUBLIC_BASE_URL || '';
}
else {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
}

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
      console.log("Usuario:", response);
      // Extrae el primer motorizado
      const usuario = response.data.usuario;

      if (username === usuario.correo) {
        const response = await axios.get<UsuarioResponse>(
          `${BASE_URL}/usuario/${username}?esCorreo=true`,
          {
            headers: {
              password: password,
            },
          }
        );
        if (response.status === 401) {
          alert("Usuario o contraseña incorrecta");
          return;
        } else if (response.status === 200) {
          setUsername("");
          setPassword("");
          storeUserData(usuario);
          // console.log("Usuario encontrado:", repartidor);
          router.push({
            pathname: "/configurar",
          });
        }
      }
    } catch (error) {
      console.error("Error al intentar login:", error);
      alert("Ocurrió un error al intentar iniciar sesión");
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <>
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
        </>
      )}
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
    color: "black",
  },
  input: {
    height: 40,
    borderColor: "white",
    backgroundColor: "white",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
