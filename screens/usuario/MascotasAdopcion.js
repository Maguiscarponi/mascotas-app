import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions 
} from "react-native";
import Header from "../../components/Header";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MascotasAdopcion({ navigation }) {
  const [mascotas, setMascotas] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    fetch("http://192.168.18.24/mascotas-api/endpoints/mascotas/adopcion.php")
      .then(res => res.json())
      .then(data => {
        setMascotas(data);
        // Animación de entrada
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      })
      .catch(err => console.error("❌ Error de red:", err));
  }, []);

  const MascotaCard = ({ item, index }) => {
    const [scaleAnim] = useState(new Animated.Value(0.9));

    useEffect(() => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DetalleMascota", { ...item, tipo_formulario: "adopcion" })}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: `http://192.168.18.24/mascotas/${item.imagen}` }} 
              style={styles.image} 
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            >
              <View style={styles.heartContainer}>
                <Ionicons name="heart" size={20} color="#FF6B6B" />
              </View>
            </LinearGradient>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.nombre}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={14} color="#666" />
              <Text style={styles.age}>{item.edad}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={14} color="#666" />
              <Text style={styles.location}>Saladillo, Buenos Aires</Text>
            </View>
            
            <LinearGradient
              colors={['#FF6B6B', '#FF8E53']}
              style={styles.adoptButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="heart" size={16} color="white" />
              <Text style={styles.adoptButtonText}>Adoptar</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      
      <View style={styles.headerSection}>
        <LinearGradient
          colors={['#FF9A9E', '#FECFEF']}
          style={styles.headerGradient}
        >
          <Ionicons name="heart" size={32} color="white" />
          <Text style={styles.title}>Mascotas en Adopción</Text>
          <Text style={styles.subtitle}>Encuentra a tu compañero perfecto</Text>
        </LinearGradient>
      </View>

      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id_mascota.toString()}
        renderItem={({ item, index }) => <MascotaCard item={item} index={index} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  headerSection: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerGradient: {
    padding: 24,
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: 'white',
    textAlign: "center",
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  list: { 
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 12,
  },
  heartContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 8,
  },
  cardContent: {
    padding: 16,
  },
  name: { 
    fontSize: 18, 
    fontWeight: "700",
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  age: { 
    fontSize: 14, 
    color: "#666",
    fontWeight: '500',
  },
  location: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  adoptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  adoptButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
});