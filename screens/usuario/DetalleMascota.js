import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetalleMascota() {
  const navigation = useNavigation();
  const route = useRoute();
  const mascota = route.params;
  const { tipo_formulario } = mascota;

  const irAlFormulario = () => {
    if (tipo_formulario === "adopcion") {
      navigation.navigate("FormularioAdopcion", { 
        id_mascota: mascota.id_mascota, 
        nombre_mascota: mascota.nombre,
        id_usuario: mascota.id_usuario  
      });
    } else if (tipo_formulario === "transito") {
      navigation.navigate("FormularioTransito", { 
        id_mascota: mascota.id_mascota,
        id_usuario: mascota.id_usuario
      });
    } else {
      navigation.navigate("FormularioConsulta", { 
        id_mascota: mascota.id_mascota, 
        nombre: mascota.nombre,
        id_usuario: mascota.id_usuario
      });
    }
  };
  

  const getBotonTexto = () => {
    if (tipo_formulario === "adopcion") return "Quiero Adoptar";
    if (tipo_formulario === "transito") return "Dar Tránsito";
    return `Tengo Información`;
  };

  const getBotonColor = () => {
    if (tipo_formulario === "adopcion") return "#FF6B35";
    if (tipo_formulario === "transito") return "#F39C12";
    return "#E74C3C";
  };

  const getBotonIcon = () => {
    if (tipo_formulario === "adopcion") return "heart";
    if (tipo_formulario === "transito") return "home";
    return "information-circle";
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `http://172.20.10.2/mascotas/${mascota.imagen}` }}
            style={styles.imagen}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {tipo_formulario === "adopcion" ? "EN ADOPCIÓN" : 
               tipo_formulario === "transito" ? "EN TRÁNSITO" : "PERDIDO"}
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerInfo}>
            <Text style={styles.petName}>{mascota.nombre}</Text>
            <View style={styles.quickInfo}>
              <View style={styles.infoChip}>
                <Ionicons name="paw" size={16} color="#FF6B35" />
                <Text style={styles.chipText}>{mascota.tipo}</Text>
              </View>
              <View style={styles.infoChip}>
                <Ionicons name="time" size={16} color="#F39C12" />
                <Text style={styles.chipText}>{mascota.edad}</Text>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Información Detallada</Text>
            
            <View style={styles.detailsGrid}>
              {[
                { key: "genero", label: "Género", icon: "male-female" },
                { key: "raza", label: "Raza", icon: "library" },
                { key: "tamano", label: "Tamaño", icon: "resize" },
                { key: "castrado", label: "Castrado", icon: "medical" },
                { key: "vacunado", label: "Vacunado", icon: "shield-checkmark" }
              ].map((item) => (
                <View style={styles.detailItem} key={item.key}>
                  <View style={styles.detailIcon}>
                    <Ionicons name={item.icon} size={20} color="#7F8C8D" />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>{item.label}</Text>
                    <Text style={styles.detailValue}>{mascota[item.key]}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: getBotonColor() }]} 
          onPress={irAlFormulario}
          activeOpacity={0.8}
        >
          <Ionicons name={getBotonIcon()} size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>{getBotonTexto()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  imagen: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: "center",
  },
  statusBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  petName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  chipText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F3',
    padding: 16,
    borderRadius: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
