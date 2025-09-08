import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  TextInput
} from 'react-native';
import { Menu, TouchableRipple, Provider, Button } from 'react-native-paper';
import ModalPublicar from '../../components/ModalPublicar';

const { width } = Dimensions.get('window');

// Componente para menús desplegables de filtro
const DropMenu = ({ label, value, options, onSelect }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.filterLabel}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setVisible(true)} style={styles.filterDropdown}>
            <Text style={styles.filterText}>{value}</Text>
          </TouchableRipple>
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
            title={option}
            titleStyle={styles.menuItemText}
          />
        ))}
      </Menu>
    </View>
  );
};

const MascotasRegistradas = ({ navigation }) => {
  const [mascotas, setMascotas] = useState([]);
  const [todasLasMascotas, setTodasLasMascotas] = useState([]);
  const [filtro, setFiltro] = useState('Todas');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Función para obtener mascotas del servidor
  const obtenerMascotas = async () => {
    setCargando(true);
    try {
      const response = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/mascotas/listar_mascotas.php'
      );
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setTodasLasMascotas(data);
      aplicarFiltros(data, filtro, filtroNombre);
    } catch (error) {
      console.error('Error cargando mascotas:', error);
      Alert.alert('Error', 'No se pudieron cargar las mascotas. Verifica tu conexión.');
    } finally {
      setCargando(false);
    }
  };

  // Función para aplicar filtros basándose solamente en el estado de publicación
  const aplicarFiltros = (data, estadoFiltro, nombreFiltro) => {
    let mascotasFiltradas = data;

    // Filtro por estado de publicación
    if (estadoFiltro === 'Sin publicar') {
      // Mostrar mascotas que no tienen publicación activa
      mascotasFiltradas = mascotasFiltradas.filter((m) => !tienePublicacionActiva(m));
    } else if (estadoFiltro !== 'Todas') {
      // Mostrar mascotas que tienen publicación activa con el tipo específico
      mascotasFiltradas = mascotasFiltradas.filter((m) => 
        tienePublicacionActiva(m) && 
        m.tipo_publicacion && 
        m.tipo_publicacion.toLowerCase() === estadoFiltro.toLowerCase()
      );
    }

    // Filtro por nombre
    if (nombreFiltro.trim() !== '') {
      mascotasFiltradas = mascotasFiltradas.filter((m) => 
        m.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())
      );
    }

    setMascotas(mascotasFiltradas);
  };

  useEffect(() => {
    obtenerMascotas();
  }, []);

  useEffect(() => {
    aplicarFiltros(todasLasMascotas, filtro, filtroNombre);
  }, [filtro, filtroNombre, todasLasMascotas]);

  //Funcion para verificar si la mascota tiene una publicación activa
  const tienePublicacionActiva = (mascota) => {
    // Una mascota tiene publicación activa solamente ssi:
    // 1. Tiene el campo publicacion_activa en true
    // 2. Y tiene un tipo_publicacion definido
    return (
      mascota.publicacion_activa && 
      (mascota.publicacion_activa === true || 
       mascota.publicacion_activa === 1 || 
       mascota.publicacion_activa === '1' ||
       mascota.publicacion_activa === 'true') &&
      mascota.tipo_publicacion && 
      mascota.tipo_publicacion.trim() !== ''
    );
  };

  // Función para eliminar mascota completamente
  const eliminarMascota = (id_mascota, nombre) => {
    Alert.alert(
      '⚠️ Eliminar Mascota', 
      `¿Estás seguro de eliminar a "${nombre}"? Esta acción no se puede deshacer.`, 
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                'http://172.20.10.2/mascotas-api/endpoints/mascotas/eliminar_mascota.php',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id_mascota })
                }
              );
              const data = await response.json();

              if (data.success) {
                Alert.alert('Éxito', 'Mascota eliminada correctamente');
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

  // Función para abrir modal de publicación
  const abrirModalPublicar = (id_mascota) => {
    setMascotaSeleccionada(id_mascota);
    setModalVisible(true);
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalVisible(false);
    setMascotaSeleccionada(null);
  };

  // Función para publicar mascota con estado específico
  const publicarMascota = async (tipoPublicacion) => {
    if (!mascotaSeleccionada) return;
    
    try {
      const formData = new FormData();
      formData.append('id_mascota', mascotaSeleccionada);
      formData.append('tipo_publicacion', tipoPublicacion);

      const response = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/mascotas/publicar_mascota.php',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response.ok) {
        Alert.alert('¡Publicado!', `Mascota publicada como "${tipoPublicacion}" exitosamente`);
        obtenerMascotas();
      } else {
        Alert.alert('Error', 'Error al publicar la mascota');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error de conexión al publicar la mascota');
    } finally {
      cerrarModal();
    }
  };

  // Función para eliminar publicación (mantener mascota sin publicar)
  const eliminarPublicacion = async (id_mascota, nombre) => {
    Alert.alert(
      'Eliminar Publicación',
      `¿Queres eliminar la publicación de "${nombre}"? La mascota seguirá registrada pero sin publicar.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Publicación',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('id_mascota', id_mascota);

              const response = await fetch(
                'http://172.20.10.2/mascotas-api/endpoints/mascotas/eliminar_publicacion.php',
                {
                  method: 'POST',
                  body: formData
                }
              );

              if (response.ok) {
                Alert.alert('Éxito', 'Publicación eliminada correctamente');
                obtenerMascotas();
              } else {
                Alert.alert('Error', 'Error al eliminar la publicación');
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'Error de conexión al eliminar la publicación');
            }
          }
        }
      ]
    );
  };

  // Función para obtener el texto que se muestra en el badge
  const obtenerTextoEstadoPublicacion = (mascota) => {
    if (!tienePublicacionActiva(mascota)) {
      return 'Sin publicar';
    }
    return mascota.tipo_publicacion || 'Publicado';
  };

  // Función para obtener color según estado de publicación
  const obtenerColorEstadoPublicacion = (mascota) => {
    if (!tienePublicacionActiva(mascota)) {
      return '#95a5a6';
    }
    
    const tipoPublicacion = mascota.tipo_publicacion?.toLowerCase() || '';
    switch (tipoPublicacion) {
      case 'adopción': 
      case 'adopcion': 
        return '#27ae60';
      case 'tránsito': 
      case 'transito': 
        return '#f39c12';
      case 'perdido': 
        return '#e74c3c';
      default: 
        return '#3498db';
    }
  };

  // Renderizar cada mascota
  const renderItem = ({ item }) => {
    const tienePublicacion = tienePublicacionActiva(item);
    const textoEstadoPublicacion = obtenerTextoEstadoPublicacion(item);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image 
            source={{ uri: `http://172.20.10.2/mascotas/${item.imagen}` }} 
            style={styles.imagen} 
          />
          <View style={styles.infoContainer}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.detalle}>{item.edad}</Text>
            <Text style={styles.detalle}>{item.tipo} - {item.raza}</Text>
            
            {/* Badge de estado de PUBLICACIÓN */}
            <View style={[styles.estadoBadge, { backgroundColor: obtenerColorEstadoPublicacion(item) }]}>
              <Text style={styles.estadoText}>{textoEstadoPublicacion}</Text>
            </View>
            
            {/* Estado interno de la mascota (separado) */}
            <Text style={styles.estadoInterno}>
              Estado interno: {item.estado || 'No definido'}
            </Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          {/* Botón principal: publicar o eliminar publicación */}
          {tienePublicacion ? (
            <TouchableOpacity 
              style={[styles.button, styles.despublicarButton]} 
              onPress={() => eliminarPublicacion(item.id_mascota, item.nombre)}
            >
              <Text style={styles.buttonText}>Eliminar Publicación</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.publicarButton]} 
              onPress={() => abrirModalPublicar(item.id_mascota)}
            >
              <Text style={styles.buttonText}>Publicar</Text>
            </TouchableOpacity>
          )}

          {/* Botones secundarios */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.button, styles.editarButton]}
              onPress={() => navigation?.navigate('EditarMascota', {
                mascota: item,
                onUpdate: obtenerMascotas
              })}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.eliminarButton]}
              onPress={() => eliminarMascota(item.id_mascota, item.nombre)}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.titulo}>Mascotas Registradas</Text>
        
        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <DropMenu
            label="Filtrar por estado de publicación:"
            value={filtro}
            options={["Todas", "Sin publicar", "Adopción", "Tránsito", "Perdido"]}
            onSelect={setFiltro}
          />
          
          <View style={styles.filtroNombreContainer}>
            <Text style={styles.filtroNombreLabel}>Filtrar por nombre:</Text>
            <TextInput
              style={styles.filtroNombreInput}
              value={filtroNombre}
              onChangeText={setFiltroNombre}
              placeholder="Buscar por nombre..."
            />
          </View>
        </View>

        {/* Lista de mascotas */}
        {cargando ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando mascotas...</Text>
          </View>
        ) : mascotas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filtroNombre.trim() !== '' 
                ? `No se encontraron mascotas con el nombre "${filtroNombre}"`
                : filtro === 'Todas' 
                  ? 'No hay mascotas registradas aún' 
                  : `No hay mascotas con estado de publicación "${filtro}"`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={mascotas}
            keyExtractor={(item, index) => `${item.id_mascota || 'sinid'}_${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Modal para publicar */}
        <ModalPublicar
          visible={modalVisible}
          onClose={cerrarModal}
          onPublicar={publicarMascota}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 15, 
    backgroundColor: '#f8f9fa'
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center'
  },
  
  // Estilos de los filtros
  filtrosContainer: {
    marginBottom: 20
  },
  dropdownWrapper: {
    marginBottom: 15
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e'
  },
  filterDropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  filterText: {
    fontSize: 16,
    color: '#2c3e50'
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2c3e50'
  },
  
  // Filtro por nombre
  filtroNombreContainer: {
    marginBottom: 10
  },
  filtroNombreLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#34495e'
  },
  filtroNombreInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2c3e50'
  },

  // Estilos de las tarjetas
  listContainer: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 15
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5
  },
  detalle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  estadoInterno: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 5
  },

  // Estilos de acciones
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 15
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2
  },
  publicarButton: {
    backgroundColor: '#3498db'
  },
  despublicarButton: {
    backgroundColor: '#f39c12'
  },
  editarButton: {
    backgroundColor: '#95a5a6'
  },
  eliminarButton: {
    backgroundColor: '#e74c3c'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },

  // Estados de carga y vacío
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center'
  }
});

export default MascotasRegistradas;
