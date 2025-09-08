import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";
import { Menu, TouchableRipple, Provider } from 'react-native-paper';

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

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [filtro, setFiltro] = useState('Todas');

  const cargarSolicitudes = () => {
    setCargando(true);
    fetch("http://172.20.10.2/mascotas-api/endpoints/mascotas/listar_solicitudes.php")
      .then((response) => response.json())
      .then((data) => {
        const ordenadas = (data.solicitudes || []).sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        
        // Aplicar filtro
        let solicitudesFiltradas = ordenadas;
        if (filtro !== 'Todas') {
          solicitudesFiltradas = ordenadas.filter((s) => s.estado === filtro);
        }
        
        setSolicitudes(solicitudesFiltradas);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error cargando solicitudes:", error);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [filtro]);

  const abrirModal = (item) => {
    setSolicitudSeleccionada(item);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setSolicitudSeleccionada(null);
  };

  const cambiarEstado = async (solicitud, nuevoEstado) => {
    if (!solicitud) {
      Alert.alert("Error", "No se pudo obtener la información de la solicitud");
      return;
    }

    try {
      const response = await fetch(
        "http://172.20.10.2/mascotas-api/endpoints/mascotas/actualizar_estado_solicitud.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_solicitud: solicitud.id,
            tipo: solicitud.tipo,
            nuevo_estado: nuevoEstado
          })
        }
      );

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        if (data.success) {
          Alert.alert("Éxito", `Solicitud ${nuevoEstado}`);
          cargarSolicitudes();
        } else {
          Alert.alert("Error", data.message || "No se pudo actualizar el estado");
        }
      } catch (parseError) {
        console.error("Respuesta no válida:", text);
        Alert.alert("Error", "Respuesta del servidor no es válida.");
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case "Pendiente": return "#f39c12";
      case "Aprobado": return "#27ae60";
      case "Rechazado": return "#e74c3c";
      case "Cerrado": return "#95a5a6";
      default: return "#bdc3c7";
    }
  };

  const obtenerTipoDisplay = (tipo) => {
    switch (tipo) {
      case "adopcion": return "Adopción";
      case "transito": return "Tránsito";
      case "perdido": return "Contacto";
      default: return tipo;
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.imagen && (
            <Image 
              source={{ uri: `http://172.20.10.2/mascotas/${item.imagen}` }} 
              style={styles.imagen} 
            />
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.nombre}>{item.nombre_mascota}</Text>
            <Text style={styles.detalle}>Solicitante: {item.nombre}</Text>
            <Text style={styles.detalle}>Email: {item.email}</Text>
            <Text style={styles.detalle}>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.tipoBadge, { backgroundColor: '#3498db' }]}>
                <Text style={styles.badgeText}>{obtenerTipoDisplay(item.tipo)}</Text>
              </View>
              <View style={[styles.estadoBadge, { backgroundColor: obtenerColorEstado(item.estado) }]}>
                <Text style={styles.badgeText}>{item.estado}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.verDetallesButton]} 
            onPress={() => abrirModal(item)}
          >
            <Text style={styles.buttonText}>Ver Detalles</Text>
          </TouchableOpacity>

          {item.estado === "Pendiente" && (
            <View style={styles.secondaryActions}>
              {(item.tipo === "adopcion" || item.tipo === "transito") && (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.aprobarButton]}
                    onPress={() => cambiarEstado(item, "Aprobado")}
                  >
                    <Text style={styles.buttonText}>Aprobar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.rechazarButton]}
                    onPress={() => cambiarEstado(item, "Rechazado")}
                  >
                    <Text style={styles.buttonText}>Rechazar</Text>
                  </TouchableOpacity>
                </>
              )}
              {item.tipo === "perdido" && (
                <TouchableOpacity
                  style={[styles.button, styles.cerrarButton]}
                  onPress={() => cambiarEstado(item, "Cerrado")}
                >
                  <Text style={styles.buttonText}>Cerrar Consulta</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Gestión de Solicitudes</Text>
        
        {/* Filtro */}
        <DropMenu
          label="Filtrar por estado:"
          value={filtro}
          options={["Todas", "Pendiente", "Aprobado", "Rechazado", "Cerrado"]}
          onSelect={setFiltro}
        />

        {/* Lista de solicitudes */}
        {solicitudes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {filtro === 'Todas' 
                ? 'No hay solicitudes registradas aún' 
                : `No hay solicitudes con estado "${filtro}"`
              }
            </Text>
          </View>
        ) : (
          <FlatList
            data={solicitudes}
            keyExtractor={(item) => `${item.id}-${item.tipo}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Modal de detalles */}
        {solicitudSeleccionada && (
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView>
                  <Text style={styles.modalTitle}>Detalle de Solicitud</Text>
                  
                  {solicitudSeleccionada.imagen && (
                    <Image
                      source={{
                        uri: "http://172.20.10.2/mascotas/" + solicitudSeleccionada.imagen
                      }}
                      style={styles.modalImage}
                    />
                  )}
                  
                  <View style={styles.modalInfo}>
                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Mascota: </Text>
                      {solicitudSeleccionada.nombre_mascota}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Tipo: </Text>
                      {obtenerTipoDisplay(solicitudSeleccionada.tipo)}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Solicitante: </Text>
                      {solicitudSeleccionada.nombre}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Email: </Text>
                      {solicitudSeleccionada.email}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Teléfono: </Text>
                      {solicitudSeleccionada.telefono}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Dirección: </Text>
                      {solicitudSeleccionada.direccion}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Estado: </Text>
                      {solicitudSeleccionada.estado}
                    </Text>

                    <Text style={styles.modalField}>
                      <Text style={styles.modalLabel}>Fecha: </Text>
                      {new Date(solicitudSeleccionada.fecha).toLocaleDateString()}
                    </Text>

                    {solicitudSeleccionada.tipo === "adopcion" && (
                      <>
                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Experiencia previa: </Text>
                          {solicitudSeleccionada.experiencia_previa}
                        </Text>

                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Acepta visita: </Text>
                          {solicitudSeleccionada.acepta_visita}
                        </Text>

                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Tipo de vivienda: </Text>
                          {solicitudSeleccionada.tipo_vivienda}
                        </Text>
                      </>
                    )}

                    {solicitudSeleccionada.tipo === "transito" && (
                      <>
                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Cubre gastos básicos: </Text>
                          {solicitudSeleccionada.cubre_gastos}
                        </Text>

                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Acepta visita: </Text>
                          {solicitudSeleccionada.acepta_visita}
                        </Text>

                        <Text style={styles.modalField}>
                          <Text style={styles.modalLabel}>Tipo de vivienda: </Text>
                          {solicitudSeleccionada.tipo_vivienda}
                        </Text>
                      </>
                    )}

                    {solicitudSeleccionada.tipo === "perdido" && (
                      <Text style={styles.modalField}>
                        <Text style={styles.modalLabel}>Información adicional: </Text>
                        {solicitudSeleccionada.mensaje}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity 
                    style={[styles.modalButton, styles.closeButton]} 
                    onPress={cerrarModal}
                  >
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 15, 
    backgroundColor: '#f8f9fa'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center'
  },
  
  // Estilos del filtro (igual que MascotasRegistradas)
  dropdownWrapper: {
    marginBottom: 20
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

  // Estilos de las tarjetas (similar a MascotasRegistradas)
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
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 5
  },
  tipoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold'
  },

  // Estilos de acciones (similar a MascotasRegistradas)
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
  verDetallesButton: {
    backgroundColor: '#3498db'
  },
  aprobarButton: {
    backgroundColor: '#27ae60'
  },
  rechazarButton: {
    backgroundColor: '#e74c3c'
  },
  cerrarButton: {
    backgroundColor: '#95a5a6'
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
  },

  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2c3e50'
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15
  },
  modalInfo: {
    marginBottom: 20
  },
  modalField: {
    fontSize: 14,
    marginBottom: 8,
    color: '#2c3e50'
  },
  modalLabel: {
    fontWeight: 'bold',
    color: '#34495e'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5
  },
  closeButton: {
    backgroundColor: '#95a5a6',
    marginTop: 10
  }
});








