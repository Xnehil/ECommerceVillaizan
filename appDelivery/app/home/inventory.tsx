import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert 
} from 'react-native';
import axios from 'axios';
import { getUserData } from '@/functions/storage';
import { Motorizado, InventarioMotorizado } from '@/interfaces/interfaces';

const baseUrl = process.env.BASE_URL;

export default function InventarioMotorizadoScreen() {
  const [inventario, setInventario] = useState<InventarioMotorizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [modificando, setModificando] = useState(false);
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null);

  // Obtener inventario del motorizado excluyendo merma
  const obtenerInventario = async () => {
    try {
      const userData = await getUserData();
      if (!userData?.id) throw new Error('No se pudo obtener el usuario.');

      const { data: motorizadoResponse } = await axios.post(`${baseUrl}/motorizado/usuario`, {
        id_usuario: userData.id,
      });

      const motorizadoData = motorizadoResponse.motorizado;
      setMotorizado(motorizadoData);

      const { data: inventarioResponse } = await axios.post(
        `${baseUrl}/inventarioMotorizado/motorizado`,
        {
          id_motorizado: motorizadoData.id,
        }
      );

      // Filtrar inventarios que no sean merma
      const inventarioValido = inventarioResponse.inventarioMotorizadoes.filter(
        (item: InventarioMotorizado) => !item.esMerma
      );

      setInventario(inventarioValido);
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      Alert.alert('Error', 'No se pudo obtener el inventario.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  const registrarMerma = async (item: InventarioMotorizado) => {
    Alert.alert(
      'Registrar merma',
      `¿Estás seguro de registrar una merma de ${item.producto.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await axios.post(`${baseUrl}/inventarioMotorizado`, {
                producto: item.producto,
                motorizado: motorizado,
                stock: 1,
                esMerma: true,
                motivoMerma: 'Producto dañado', // Ajustar según el caso
              });

              // Disminuir del inventario principal
              await manejarCambioCantidad(item.id, 1, 'disminuir');
              Alert.alert('Merma registrada', 'La merma se registró exitosamente.');
              obtenerInventario(); // Refrescar la lista
            } catch (error) {
              console.error('Error al registrar la merma:', error);
              Alert.alert('Error', 'No se pudo registrar la merma.');
            }
          },
        },
      ]
    );
  };

  const manejarCambioCantidad = async (id: string, cantidad: number, operacion: 'aumentar' | 'disminuir') => {
    try {
      await axios.patch(`${baseUrl}/inventarioMotorizado/${id}/${operacion}`, { cantidad });
      Alert.alert('Operación exitosa', `Cantidad ${operacion === 'aumentar' ? 'aumentada' : 'disminuida'}.`);
      obtenerInventario(); // Refrescar el inventario
    } catch (error) {
      console.error(`Error al ${operacion} inventario:`, error);
      Alert.alert('Error', `No se pudo ${operacion} el inventario.`);
    }
  };

  const renderItem = ({ item }: { item: InventarioMotorizado }) => (
    <View style={styles.productoContainer}>
      <Text style={styles.productoTexto}>{item.producto.nombre}</Text>
      <Text style={styles.cantidadTexto}>{item.stock} und.</Text>

      {modificando && (
        <View style={styles.botonesCantidad}>
          <TouchableOpacity
            style={styles.botonCantidad}
            onPress={() => manejarCambioCantidad(item.id, 1, 'disminuir')}
          >
            <Text style={styles.botonTexto}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonCantidad}
            onPress={() => manejarCambioCantidad(item.id, 1, 'aumentar')}
          >
            <Text style={styles.botonTexto}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botonMerma}
            onPress={() => registrarMerma(item)}
          >
            <Text style={styles.botonTexto}>Merma</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Cargando inventario...</Text>
      ) : (
        <>
          <FlatList
            data={inventario}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.botonesContainer}>
            <TouchableOpacity 
              style={styles.boton} 
              onPress={() => setModificando(!modificando)}
            >
              <Text style={styles.botonTexto2}>{modificando ? 'Cancelar' : 'Modificar'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  productoTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cantidadTexto: {
    fontSize: 18,
    color: '#333',
  },
  botonesCantidad: {
    flexDirection: 'row',
  },
  botonCantidad: {
    backgroundColor: '#aa0000',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  botonMerma: {
    backgroundColor: '#555',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  botonesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  boton: {
    backgroundColor: '#aa0000',
    padding: 15,
    borderRadius: 10,
  },
  botonTexto2: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
