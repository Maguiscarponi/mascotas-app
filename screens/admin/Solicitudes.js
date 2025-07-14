import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const cargarSolicitudes = () => {
    fetch("http://192.168.18.24/mascotas-api/endpoints/mascotas/listar_solicitudes.php")
      .then((response) => response.json())
      .then((data) => {
        const ordenadas = (data.solicitudes || []).sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setSolicitudes(ordenadas);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error cargando solicitudes:", error);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const abrirModal = (item) => {
    setSolicitudSeleccionada(item);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setSolicitudSeleccionada(null);
  };

  const actualizarEstado = async (nuevoEstado) => {
    if (!solicitudSeleccionada) return;

    try {
      const response = await fetch(
        "http://192.168.18.24/mascotas-api/endpoints/mascotas/actualizar_estado_solicitud.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_solicitud: solicitudSeleccionada.id,
            tipo: solicitudSeleccionada.tipo,
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
          cerrarModal();
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

  if (cargando) {
    return (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color="#eb5d37" />
      </View>
    );
  }

  return (
    <View style={styles.contenedorPantalla}>
      <Text style={styles.tituloPantalla}>Gestión de Solicitudes</Text>

      <ScrollView horizontal>
        <View>
          <View style={styles.filaEncabezadoTabla}>
            <Text style={[styles.celdaEncabezado, { width: 100 }]}>Fecha</Text>
            <Text style={[styles.celdaEncabezado, { width: 100 }]}>Tipo</Text>
            <Text style={[styles.celdaEncabezado, { width: 150 }]}>Mascota</Text>
            <Text style={[styles.celdaEncabezado, { width: 180 }]}>Solicitante</Text>
            <Text style={[styles.celdaEncabezado, { width: 120 }]}>Estado</Text>
            <Text style={[styles.celdaEncabezado, { width: 200 }]}>Acciones</Text>
          </View>

          {solicitudes.map((item) => (
            <View key={`${item.id}-${item.tipo}`} style={styles.contenedorFilaTabla}>
              <View style={styles.filaTabla}>
                <Text style={[styles.celdaTabla, { width: 100 }]}>
                  {new Date(item.fecha).toLocaleDateString()}
                </Text>
                <Text style={[styles.celdaTabla, { width: 100 }]}>
                  {item.tipo === "adopcion"
                    ? "Adopción"
                    : item.tipo === "transito"
                    ? "Tránsito"
                    : "Contacto"}
                </Text>
                <View
                  style={[
                    styles.celdaTabla,
                    { width: 150, flexDirection: "row", alignItems: "center" }
                  ]}
                >
                  {item.imagen && (
                    <Image
                      source={{ uri: "http://192.168.18.24/mascotas/" + item.imagen }}
                      style={styles.miniaturaMascota}
                    />
                  )}
                  <Text>{item.nombre_mascota}</Text>
                </View>
                <Text style={[styles.celdaTabla, { width: 180 }]}>{item.email}</Text>
                <View style={[styles.celdaTabla, { width: 120 }]}>
                  {renderBadge(item.estado)}
                </View>
                <View style={[styles.celdaTabla, { width: 200 }]}>
                  <TouchableOpacity
                    style={styles.botonVerDetalles}
                    onPress={() => abrirModal(item)}
                  >
                    <Text style={styles.textoBotonVerDetalles}>Ver detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {solicitudSeleccionada && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.fondoModal}>
            <View style={styles.contenedorModal}>
              <ScrollView>
                <Text style={styles.encabezadoModal}>Detalle de Solicitud</Text>
                {solicitudSeleccionada.imagen && (
                  <Image
                    source={{
                      uri: "http://192.168.18.24/mascotas/" + solicitudSeleccionada.imagen
                    }}
                    style={styles.imagenModalMascota}
                  />
                )}
                <View style={styles.contenedorInfoModal}>

                  <Text>
                    <Text style={styles.etiquetaModal}>Mascota: </Text>
                    {solicitudSeleccionada.nombre_mascota}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Tipo: </Text>
                    {solicitudSeleccionada.tipo}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Solicitante: </Text>
                    {solicitudSeleccionada.nombre}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Email: </Text>
                    {solicitudSeleccionada.email}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Teléfono: </Text>
                    {solicitudSeleccionada.telefono}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Dirección: </Text>
                    {solicitudSeleccionada.direccion}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Estado: </Text>
                    {solicitudSeleccionada.estado}
                  </Text>

                  <Text>
                    <Text style={styles.etiquetaModal}>Fecha: </Text>
                    {new Date(solicitudSeleccionada.fecha).toLocaleDateString()}
                  </Text>

                </View>

                {solicitudSeleccionada.estado === "Pendiente" && (
                  <View style={styles.contenedorAccionesModal}>
                    {(solicitudSeleccionada.tipo === "adopcion" ||
                      solicitudSeleccionada.tipo === "transito") && (
                      <>
                        <TouchableOpacity
                          style={styles.botonAprobar}
                          onPress={() => actualizarEstado("Aprobado")}
                        >
                          <Text style={styles.textoBotonModal}>Aprobar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.botonRechazar}
                          onPress={() => actualizarEstado("Rechazado")}
                        >
                          <Text style={styles.textoBotonModal}>Rechazar</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {solicitudSeleccionada.tipo === "perdido" && (
                      <TouchableOpacity
                        style={styles.botonCerrar}
                        onPress={() => actualizarEstado("Cerrado")}
                      >
                        <Text style={styles.textoBotonModal}>Cerrar consulta</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                <TouchableOpacity style={styles.botonCerrarModal} onPress={cerrarModal}>
                  <Text style={styles.textoBotonCerrarModal}>Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const renderBadge = (estado) => {
  let backgroundColor;
  switch (estado) {
    case "Pendiente":
      backgroundColor = "#f1c40f";
      break;
    case "Aprobado":
      backgroundColor = "#2ecc71";
      break;
    case "Rechazado":
      backgroundColor = "#e74c3c";
      break;
    case "Cerrado":
      backgroundColor = "#7f8c8d";
      break;
    default:
      backgroundColor = "#bdc3c7";
  }

  return (
    <View style={[styles.badgeEstado, { backgroundColor }]}>
      <Text style={styles.textoBadgeEstado}>{estado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Contenedores principales
  contenedorPantalla: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  // Títulos
  tituloPantalla: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  // Encabezado de tabla
  filaEncabezadoTabla: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10
  },
  celdaEncabezado: {
    fontWeight: "bold",
    textAlign: "center"
  },
  // Filas y celdas
  contenedorFilaTabla: {
    backgroundColor: "#fafafa",
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  filaTabla: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  celdaTabla: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  // Miniatura de mascota en la lista
  miniaturaMascota: {
    width: 40,
    height: 40,
    marginRight: 5,
    borderRadius: 5
  },
  // Botón Ver detalles
  botonVerDetalles: {
    backgroundColor: "#3498db",
    padding: 5,
    borderRadius: 5,
    margin: 3
  },
  textoBotonVerDetalles: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12
  },
  // Badge de estado
  badgeEstado: {
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 8
  },
  textoBadgeEstado: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center"
  },
  // Fondo del modal
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  contenedorModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "90%"
  },
  // Encabezado del modal
  encabezadoModal: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  // Imagen de la mascota en el modal
  imagenModalMascota: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10
  },
  // Contenedor de la información en el modal
  contenedorInfoModal: {
    width: "100%",
    marginTop: 10
  },
  etiquetaModal: {
    fontWeight: "bold"
  },
  // Contenedor de los botones de acción en el modal
  contenedorAccionesModal: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20
  },
  botonAprobar: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5
  },
  botonRechazar: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5
  },
  botonCerrar: {
    backgroundColor: "#7f8c8d",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5
  },
  textoBotonModal: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  // Botón cerrar modal
  botonCerrarModal: {
    backgroundColor: "#eb5d37",
    padding: 10,
    borderRadius: 5,
    marginTop: 20
  },
  textoBotonCerrarModal: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  }
});











