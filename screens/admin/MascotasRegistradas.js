import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ModalPublicar from '../../components/ModalPublicar';

const MascotasRegistradas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  // 1) Función para obtener mascotas (filtradas según 'filtro')
  const obtenerMascotas = async () => {
    try {
      // Se conserva la IP y la ruta exacta que usaba antes
      const response = await fetch(
        'http://192.168.18.24/mascotas-api/endpoints/mascotas/listar_mascotas.php'
      );
      const data = await response.json();

      if (filtro === 'Todas') {
        setMascotas(data);
      } else if (filtro === 'Sin publicar') {
        const sinPublicar = data.filter(
          (m) => !m.estado || m.estado.trim() === ''
        );
        setMascotas(sinPublicar);
      } else {
        const filtradas = data.filter((m) => m.estado === filtro);
        setMascotas(filtradas);
      }
    } catch (error) {
      console.error('Error cargando mascotas registradas:', error);
    }
  };

  // Se llama cada vez que cambie 'filtro'
  useEffect(() => {
    obtenerMascotas();
  }, [filtro]);

  // 2) Función para eliminar la mascota (acción "Eliminar" de la columna Acciones)
  const eliminarMascota = (id_mascota) => {
    Alert.alert(
      '¿Eliminar mascota?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                'http://192.168.18.24/mascotas-api/endpoints/mascotas/eliminar_mascota.php',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id_mascota })
                }
              );
              const data = await response.json();

              if (data.success) {
                Alert.alert('Éxito', 'Mascota eliminada correctamente');
                // Refrescar la lista
                obtenerMascotas();
              } else {
                Alert.alert('Error', data.message || 'No se pudo eliminar la mascota.');
              }
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'Ocurrió un error al eliminar la mascota.');
            }
          }
        }
      ]
    );
  };

  // 3) Abrir el modal de Publicar, guardando el id de la mascota seleccionada
  const abrirModalPublicar = (id_mascota) => {
    setMascotaSeleccionada(id_mascota);
    setModalVisible(true);
  };

  // 4) Cerrar el modal y resetear selección
  const cerrarModal = () => {
    setModalVisible(false);
    setMascotaSeleccionada(null);
  };

  // 5) Enviar la publicación (POST a publicar_mascota.php)
  const publicarMascota = async (tipoPublicacion) => {
    if (!mascotaSeleccionada) return;
    try {
      const formData = new FormData();
      formData.append('id_mascota', mascotaSeleccionada);
      formData.append('tipo_publicacion', tipoPublicacion);

      const response = await fetch(
        'http://192.168.18.24/mascotas-api/endpoints/mascotas/publicar_mascota.php',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        Alert.alert('', 'Mascota publicada con éxito');
        // Actualizar localmente el estado para mostrar "Eliminar publicación"
        setMascotas((prev) =>
          prev.map((m) =>
            m.id_mascota === mascotaSeleccionada
              ? { ...m, estado: tipoPublicacion }
              : m
          )
        );
      } else {
        Alert.alert('', 'Error al publicar la mascota');
      }
    } catch (error) {
      Alert.alert('', 'Error de red al publicar la mascota');
    } finally {
      cerrarModal();
    }
  };

  // 6) Eliminar la publicación (POST a eliminar_publicacion.php)
  const eliminarPublicacion = async (id_mascota) => {
    try {
      const formData = new FormData();
      formData.append('id_mascota', id_mascota);

      const response = await fetch(
        'http://192.168.18.24/mascotas-api/endpoints/mascotas/eliminar_publicacion.php',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        Alert.alert('', 'Publicación eliminada con éxito');
        // Actualizar localmente el estado para volver a mostrar "Publicar"
        setMascotas((prev) =>
          prev.map((m) =>
            m.id_mascota === id_mascota ? { ...m, estado: '' } : m
          )
        );
      } else {
        Alert.alert('', 'Error al eliminar la publicación');
      }
    } catch (error) {
      Alert.alert('', 'Error de red al eliminar la publicación');
    }
  };

  // 7) Renderizar cada fila de la tabla
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      {/* Columna: ID Mascota */}
      <Text style={styles.cell}>{item.id_mascota}</Text>

      {/* Columna: Imagen */}
      <Image
        source={{ uri: `http://192.168.18.24/mascotas/${item.imagen}` }}
        style={styles.imagen}
      />

      {/* Columna: Nombre */}
      <Text style={styles.cell}>{item.nombre}</Text>

      {/* Columna: Edad */}
      <Text style={styles.cell}>{item.edad}</Text>

      {/* Columna: Estado (Adopción, Tránsito, Perdido o "Sin publicar") */}
      <Text style={styles.cell}>{item.estado || 'Sin publicar'}</Text>

      {/* Columna: Botón Publicar / Eliminar publicación */}
      <View style={styles.cell}>
        {item.estado && item.estado.trim() !== '' ? (
          // Si ya tiene estado (está publicado), mostrar "Eliminar publicación"
          <TouchableOpacity
            style={[styles.button, styles.eliminarPub]}
            onPress={() => eliminarPublicacion(item.id_mascota)}
          >
            <Text style={styles.buttonText}>Eliminar publicación</Text>
          </TouchableOpacity>
        ) : (
          // Si no está publicado, mostrar "Publicar" para abrir modal
          <TouchableOpacity
            style={[styles.button, styles.publicar]}
            onPress={() => abrirModalPublicar(item.id_mascota)}
          >
            <Text style={styles.buttonText}>Publicar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Columna: Botones Editar y Eliminar mascota */}
      <View style={styles.cell}>
        <TouchableOpacity
          style={[styles.button, styles.editar]}
          onPress={() =>
            navigation.navigate('EditarMascota', { mascota: item })
          }
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.eliminar]}
          onPress={() => eliminarMascota(item.id_mascota)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView horizontal>
      <View style={styles.container}>
        {/* Título */}
        <Text style={styles.title}>Mascotas Registradas</Text>

        {/* Filtro por estado */}
        <Picker
          selectedValue={filtro}
          onValueChange={(value) => setFiltro(value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas" value="Todas" />
          <Picker.Item label="Sin publicar" value="Sin publicar" />
          <Picker.Item label="Adopción" value="Adopción" />
          <Picker.Item label="Tránsito" value="Tránsito" />
          <Picker.Item label="Perdido" value="Perdido" />
        </Picker>

        {/* Lista de mascotas */}
        <FlatList
          data={mascotas}
          keyExtractor={(item) => item.id_mascota.toString()}
          renderItem={renderItem}
        />

        {/* Modal para elegir tipo de publicación */}
        <ModalPublicar
          visible={modalVisible}
          onClose={cerrarModal}
          onPublicar={publicarMascota}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    minWidth: 1000 // para que entren todas las columnas
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  picker: {
    width: 250,
    marginBottom: 10,
    backgroundColor: '#f5f5f5'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: 8,
    alignItems: 'center'
  },
  cell: {
    flex: 1,
    marginHorizontal: 5
  },
  imagen: {
    width: 50,
    height: 50,
    borderRadius: 5
  },
  button: {
    padding: 5,
    margin: 2,
    borderRadius: 4,
    alignItems: 'center'
  },
  publicar: {
    backgroundColor: '#ec6b4f'
  },
  eliminarPub: {
    backgroundColor: '#ffc107'
  },
  editar: {
    backgroundColor: '#6c757d'
  },
  eliminar: {
    backgroundColor: '#dc3545'
  },
  buttonText: {
    color: '#fff'
  }
});

export default MascotasRegistradas;




