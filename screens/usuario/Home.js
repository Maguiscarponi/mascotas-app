import React, { useEffect, useState } from "react";
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
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnims] = useState([
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
    new Animated.Value(0.8),
  ]);

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userData");
      if (!session) {
        navigation.navigate("Login");
      }
    };
    checkSession();

    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animaciones escalonadas para las tarjetas
    scaleAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const cards = [
    {
      title: "🐾 Mascotas en Adopción",
      subtitle: "Dale un hogar lleno de amor a una mascota",
      action: "Ver mascotas",
      route: "Adopcion",
      gradient: ['#FF9A9E', '#FECFEF'],
      icon: "heart",
    },
    {
      title: "🏠 Mascotas en Tránsito",
      subtitle: "Ayudá temporalmente mientras encuentra hogar definitivo",
      action: "Ver mascotas",
      route: "Transito",
      gradient: ['#A8EDEA', '#FED6E3'],
      icon: "time",
    },
    {
      title: "🔍 Mascotas Perdidas",
      subtitle: "Ayudanos a reunir mascotas perdidas con sus familias",
      action: "Ver mascotas",
      route: "Perdidas",
      gradient: ['#FFECD2', '#FCB69F'],
      icon: "search",
    },
    {
      title: "📢 Reportar Mascota",
      subtitle: "¿Encontraste o perdiste una mascota? Reportala acá",
      action: "Reportar",
      route: "ChatUsuario",
      gradient: ['#667eea', '#764ba2'],
      icon: "chatbubble",
    },
    {
      title: "❤️ Realizar Donación",
      subtitle: "Tu ayuda es fundamental para continuar con nuestra labor",
      action: "Donar",
      route: "Donaciones",
      gradient: ['#f093fb', '#f5576c'],
      icon: "gift",
    },
  ];

  const AnimatedCard = ({ card, index }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnims[index] }],
          opacity: fadeAnim,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate(card.route)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={card.gradient}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Ionicons name={card.icon} size={32} color="white" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>{card.title}</Text>
          </View>
          <Text style={styles.cardText}>{card.subtitle}</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{card.action}</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image source={require("../../assets/portada.jpg")} style={styles.banner} />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.overlay}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Bienvenidos a Adoptame Saladillo</Text>
              <Text style={styles.heroSubtitle}>
                ¡Encontrá a tu compañero perfecto, o ayudá a una mascota a encontrar su hogar!
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Adopciones</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>200+</Text>
                  <Text style={styles.statLabel}>Familias Felices</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Rescates</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>¿Cómo podés ayudar?</Text>
          {cards.map((card, index) => (
            <AnimatedCard key={index} card={card} index={index} />
          ))}
        </View>

        <View style={styles.footer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.footerGradient}
          >
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.footerText}>
              Conectando corazones con patitas desde Saladillo
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  heroSection: {
    position: 'relative',
    height: 300,
  },
  banner: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backdropFilter: 'blur(10px)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },
  cardsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
    minHeight: 160,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.95,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  footer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  footerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});