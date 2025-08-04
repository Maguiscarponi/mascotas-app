import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function DetalleMascota() {
  const navigation = useNavigation();
  const route = useRoute();
  const mascota = route.params;
  const { tipo_formulario } = mascota;
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    if (tipo_formulario === "adopcion") return "Enviar formulario de Adopción";
    if (tipo_formulario === "transito") return "Enviar formulario de Tránsito";
    return `Consultar por ${mascota.nombre}`;
  };

  const getGradientColors = () => {
    if (tipo_formulario === "adopcion") return ['#FF6B6B', '#FF8E53'];
    if (tipo_formulario === "transito") return ['#A8EDEA', '#FED6E3'];
    return ['#FFECD2', '#FCB69F'];
  };

  const getIcon = () => {
    if (tipo_formulario === "adopcion") return "heart";
    if (tipo_formulario === "transito") return "home";
    return "help-circle";
  };

  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color="#667eea" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header con imagen */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image
          source={{ uri: `http://192.168.18.24/mascotas/${mascota.imagen}` }}
          style={styles.image}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text style={styles.petName}>{mascota.nombre}</Text>
            <View style={styles.typeContainer}>
              <Ionicons name={getIcon()} size={16} color="white" />
              <Text style={styles.petType}>
                {tipo_formulario === "adopcion" ? "En Adopción" : 
                 tipo_formulario === "transito" ? "En Tránsito" : "Perdido"}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Contenido principal */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <InfoItem icon="paw" label="Tipo" value={mascota.tipo} />
          <InfoItem icon="male-female" label="Género" value={mascota.genero} />
          <InfoItem icon="ribbon" label="Raza" value={mascota.raza} />
          <InfoItem icon="resize" label="Tamaño" value={mascota.tamano} />
          <InfoItem icon="calendar" label="Edad" value={mascota.edad} />
          <InfoItem icon="medical" label="Castrado" value={mascota.castrado} />
          <InfoItem icon="shield-checkmark" label="Vacunado" value={mascota.vacunado} />
        </View>

        {/* Botón de acción */}
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={irAlFormulario}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name={getIcon()} size={24} color="white" />
            <Text style={styles.actionButtonText}>{getBotonTexto()}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Información adicional */}
        <View style={styles.additionalInfo}>
          <View style={styles.locationInfo}>
            <Ionicons name="location" size={20} color="#667eea" />
            <Text style={styles.locationText}>Saladillo, Buenos Aires</Text>
          </View>
          <Text style={styles.helpText}>
            {tipo_formulario === "adopcion" 
              ? "Al adoptar, te comprometes a brindar amor y cuidados de por vida."
              : tipo_formulario === "transito"
              ? "El tránsito es temporal hasta encontrar familia definitiva."
              : "Cualquier información puede ayudar a reunir esta mascota con su familia."
            }
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  imageContainer: {
    position: 'relative',
    height: height * 0.5,
  },
  image: { 
    width: "100%", 
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  nameContainer: {
    alignItems: 'center',
  },
  petName: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginTop: 8,
    gap: 6,
  },
  petType: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 2,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  additionalInfo: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});