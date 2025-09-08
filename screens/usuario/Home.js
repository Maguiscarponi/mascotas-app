
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userData");
      if (!session) {
        navigation.navigate("Login");
      }
    };
    checkSession();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Header />
        
        <View style={styles.heroSection}>
          <Image source={require("../../assets/portada.jpg")} style={styles.banner} />
          <View style={styles.overlay}>
            <View style={styles.heroContent}>
              <Text style={styles.title}>Bienvenidos a AdoptaAR</Text>
              <Text style={styles.subtitle}>
                Conectando corazones con patitas en Argentina 🐾
              </Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="heart" size={20} color="#FF6B35" />
                  <Text style={styles.statText}>+500 Adoptados</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="home" size={20} color="#FF6B35" />
                  <Text style={styles.statText}>Hogares Felices</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={[styles.card, styles.adoptionCard]} onPress={() => navigation.navigate("Adopcion")}>
            <View style={styles.cardIcon}>
              <Ionicons name="heart" size={32} color="#FF6B35" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Mascotas en Adopción</Text>
              <Text style={styles.cardText}>Dale un hogar lleno de amor a una mascota que lo necesita</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color="#FF6B35" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.transitCard]} onPress={() => navigation.navigate("Transito")}>
            <View style={styles.cardIcon}>
              <Ionicons name="time" size={32} color="#F39C12" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Mascotas en Tránsito</Text>
              <Text style={styles.cardText}>Ayudá temporalmente mientras encuentran su hogar definitivo</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color="#F39C12" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.lostCard]} onPress={() => navigation.navigate("Perdidas")}>
            <View style={styles.cardIcon}>
              <Ionicons name="search" size={32} color="#E74C3C" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Mascotas Perdidas</Text>
              <Text style={styles.cardText}>Ayudanos a reunir mascotas perdidas con sus familias</Text>
            </View>
            <View style={styles.cardArrow}>
              <Ionicons name="chevron-forward" size={24} color="#E74C3C" />
            </View>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionCard, styles.reportCard]} onPress={() => navigation.navigate("ChatUsuario")}>
              <View style={styles.actionIcon}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#9B59B6" />
              </View>
              <Text style={styles.actionTitle}>Reportar</Text>
              <Text style={styles.actionText}>¿Encontraste una mascota?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, styles.donateCard]} onPress={() => navigation.navigate("Donaciones")}>
              <View style={styles.actionIcon}>
                <Ionicons name="gift" size={28} color="#27AE60" />
              </View>
              <Text style={styles.actionTitle}>Donar</Text>
              <Text style={styles.actionText}>Tu ayuda es fundamental</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Text style={styles.bottomTitle}>Juntos hacemos la diferencia</Text>
          <Text style={styles.bottomText}>
            Cada adopción, cada donación y cada acto de amor cuenta para darles una segunda oportunidad.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  heroSection: {
    position: 'relative',
    marginBottom: 30,
  },
  banner: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: "center",
    padding: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
    textAlign: "center",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statText: {
    color: '#2C3E50',
    fontWeight: '600',
    fontSize: 12,
    marginTop: 4,
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  adoptionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  transitCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  lostCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardArrow: {
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#2C3E50',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 15,
    color: "#7F8C8D",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  reportCard: {
    borderTopWidth: 4,
    borderTopColor: '#9B59B6',
  },
  donateCard: {
    borderTopWidth: 4,
    borderTopColor: '#27AE60',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 6,
    textAlign: 'center',
  },
  actionText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 16,
  },
  bottomSection: {
    backgroundColor: '#FF6B35',
    margin: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  bottomTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  bottomText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
});
