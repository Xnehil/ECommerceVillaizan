import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";  
import axios from "axios";
import { Notificacion } from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";
import { FontAwesome } from "@expo/vector-icons";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; 

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionSeleccionada, setNotificacionSeleccionada] = useState<string | null>(null);
  const [filtroLeido, setFiltroLeido] = useState("todas"); // Filtro para leídas/no leídas
  const [filtroTipo, setFiltroTipo] = useState("todos"); // Filtro por tipo de notificación
  const [tiposNotificacion, setTiposNotificacion] = useState<Set<string>>(new Set());

  // Función para obtener las notificaciones del usuario
  const fetchNotificaciones = async () => {
    try {
      const userData = await getUserData();
      if (!userData) throw new Error("Usuario no encontrado");

      const response = await axios.get(
        `${BASE_URL}/notificacion?id_usuario=${userData.id}`
      );
      const notificacionesData = response.data.notificaciones;

      setNotificaciones(notificacionesData);
      const tipos = new Set<string>(notificacionesData.map((notificacion: Notificacion) => notificacion.tipoNotificacion));
      setTiposNotificacion(tipos);
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
  }, []);

  // Función para manejar la selección de una notificación
  const handleNotificacionPress = async (id: string) => {
    const previousSelectedId = notificacionSeleccionada;
    setNotificacionSeleccionada(notificacionSeleccionada === id ? null : id);

    // Actualizar estado leido de la notificación previamente seleccionada
    if (previousSelectedId) {
      const previousNotificacionIndex = notificaciones.findIndex((notificacion) => notificacion.id === previousSelectedId);
      if (previousNotificacionIndex !== -1) {
        const previousNotificacion = notificaciones[previousNotificacionIndex];
        previousNotificacion.leido = true;
        notificaciones[previousNotificacionIndex] = previousNotificacion;
        // Actualizar en la base de datos
        try {
          await axios.put(`${BASE_URL}/notificacion/${previousSelectedId}`, previousNotificacion);
          setNotificaciones([...notificaciones]);
        } catch (error) {
          console.error("Error al actualizar la notificación:", error);
        }
      }
    }
  };

  const handleNotificacionStateChange = async (id: string) => {

      const notificacionIndex = notificaciones.findIndex((notificacion) => notificacion.id === id);
      if (notificacionIndex !== -1) {
        const notificacion = notificaciones[notificacionIndex];
        notificacion.leido = !notificacion.leido;
        notificaciones[notificacionIndex] = notificacion;
        // Actualizar en la base de datos
        try {
          await axios.put(`${BASE_URL}/notificacion/${id}`, notificacion);
          setNotificaciones([...notificaciones]);
        } catch (error) {
          console.error("Error al actualizar la notificación:", error);
        }
      }
  }
  

  // Filtrar notificaciones basadas en los filtros seleccionados
  const notificacionesFiltradas = notificaciones.filter((notificacion) => {
    const cumpleLeido =
      filtroLeido === "todas" ||
      (filtroLeido === "leidas" && notificacion.leido) ||
      (filtroLeido === "no_leidas" && !notificacion.leido);

    const cumpleTipo =
      filtroTipo === "todos" || notificacion.tipoNotificacion === filtroTipo;

    return cumpleLeido && cumpleTipo;
  });

  const renderNotificacion = ({ item }: { item: Notificacion }) => (
    <TouchableOpacity onPress={() => handleNotificacionPress(item.id)} style={styles.notificacionCard}>
      <View style={styles.iconContainer}>
        <FontAwesome name="bell" size={24} color="#666" />
      </View>
      <View style={styles.notificacionContent}>
        <Text style={styles.asunto}>{item.asunto}</Text>
        <Text style={styles.tipo}>{item.tipoNotificacion}</Text>
        <Text style={styles.fecha}>{item.creadoEn}</Text>
        {notificacionSeleccionada === item.id && item.descripcion && (
          <Text style={styles.descripcion}>{item.descripcion}</Text>
        )}
      </View>
      {!item.leido ? (
        <TouchableOpacity style={styles.actionIcon} onPress={() => handleNotificacionStateChange(item.id)}>
          <FontAwesome name="envelope" size={20} color="#666" />
        </TouchableOpacity>

      ) : (
        <TouchableOpacity style={styles.actionIcon} onPress={() => handleNotificacionStateChange(item.id)}>
          <FontAwesome name="envelope-open" size={20} color="#666" />
        </TouchableOpacity>
      )}
      
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subheader}>
        Administra las notificaciones sobre tus actividades en el sistema.
      </Text>

      <Text style={styles.filtroText}>Filtros:</Text>
      <View style={styles.filtrosContainer}>
        <View style={styles.filtro}>
          <Text style={styles.filtroLabel}>Mostrar:</Text>
          <Picker
            selectedValue={filtroLeido}
            style={styles.picker}
            onValueChange={(itemValue: string) => setFiltroLeido(itemValue)}
          >
            <Picker.Item label="Todas" value="todas" />
            <Picker.Item label="Leídas" value="leidas" />
            <Picker.Item label="No leídas" value="no_leidas" />
          </Picker>
        </View>

        <View style={styles.filtro}>
          <Text style={styles.filtroLabel}>Tipo:</Text>
          <Picker
            selectedValue={filtroTipo}
            style={styles.picker}
            onValueChange={(itemValue: string) => setFiltroTipo(itemValue)}
          >
            <Picker.Item label="Todos" value="todos" />
            {[...tiposNotificacion].map((tipo) => (
              <Picker.Item key={tipo} label={tipo} value={tipo} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.notificacionesContainer}>
        <FlatList
          data={notificacionesFiltradas}
          renderItem={renderNotificacion}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.noNotificaciones}>No hay notificaciones</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  subheader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  filtroText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filtro: {
    flex: 1,
    marginHorizontal: 5,
  },
  filtroLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  picker: {
    height: 40,
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
  },
  notificacionesContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2", // Color gris claro para diferenciar el contenedor
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  notificacionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 15,
  },
  notificacionContent: {
    flex: 1,
  },
  asunto: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tipo: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  fecha: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  descripcion: {
    fontSize: 12,
    color: "#333",
    marginTop: 10,
    backgroundColor: "#eaeaea",
    padding: 8,
    borderRadius: 5,
  },
  actionIcon: {
    marginLeft: 10,
  },
  noNotificaciones: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});
