import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  useEffect(() => {
    const loadUser = async () => {
      const session = await AsyncStorage.getItem("userData");
      if (session) {
        const user = JSON.parse(session);
        setNombre(user.nombre || "");
        setRol(user.rol || "");
      }
    };
    loadUser();

    // Animación de entrada
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
    ]).start();
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  const NavButton = ({ onPress, children, icon, isAdmin = false }) => (
    <TouchableOpacity 
      style={[styles.navButton, isAdmin && styles.adminButton]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isAdmin ? ['#FF6B6B', '#FF8E53'] : ['#667eea', '#764ba2']}
        style={styles.navButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon && <Ionicons name={icon} size={16} color="white" style={styles.navIcon} />}
        <Text style={styles.navButtonText}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={24} color="white" />
          <Text style={styles.logo}>Adoptame Saladillo</Text>
          <Ionicons name="paw" size={20} color="white" />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.navContainer}
        >
          {rol === "admin" && (
            <NavButton 
              onPress={() => navigation.navigate("DashboardAdmin")}
              icon="settings"
              isAdmin={true}
            >
              Panel Admin
            </NavButton>
          )}

          <NavButton 
            onPress={() => navigation.navigate("Adopcion")}
            icon="home"
          >
            Adopción
          </NavButton>

          <NavButton 
            onPress={() => navigation.navigate("Transito")}
            icon="time"
          >
            Tránsito
          </NavButton>

          <NavButton 
            onPress={() => navigation.navigate("Perdidas")}
            icon="search"
          >
            Perdidas
          </NavButton>

          <NavButton 
            onPress={() => navigation.navigate("ChatUsuario")}
            icon="chatbubble"
          >
            Reportar
          </NavButton>
          
          <NavButton 
            onPress={() => navigation.navigate("Donaciones")}
            icon="gift"
          >
            Donar
          </NavButton>
        </ScrollView>

        <View style={styles.authContainer}>
          {!nombre ? (
            <View style={styles.authButtons}>
              <TouchableOpacity 
                style={styles.authButton} 
                onPress={() => navigation.navigate("Login")}
                activeOpacity={0.8}
              >
                <Text style={styles.authButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.authButton, styles.registerButton]} 
                onPress={() => navigation.navigate("Registro")}
                activeOpacity={0.8}
              >
                <Text style={styles.registerButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.userInfo}>
              <View style={styles.welcomeContainer}>
                <Ionicons name="person-circle" size={20} color="white" />
                <Text style={styles.welcome}>Hola, {nombre}</Text>
              </View>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={cerrarSesion}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out" size={16} color="white" />
                <Text style={styles.logoutText}>Salir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  logo: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  navContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  navButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  adminButton: {
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.4,
  },
  navButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  navIcon: {
    marginRight: 2,
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  authContainer: {
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  authButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  registerButton: {
    backgroundColor: 'white',
  },
  authButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  registerButtonText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 14,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  welcome: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Header;