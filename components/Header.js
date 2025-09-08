import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  const navigation = useNavigation();
  const [nombre, setNombre] = useState(null);
  const [rol, setRol] = useState(null); 

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
  }, []);

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="heart" size={24} color="#FF6B35" />
        <Text style={styles.logo}>AdoptaAR</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContainer}>

          {rol === "admin" && (
          <TouchableOpacity style={styles.adminButton} onPress={() => navigation.navigate("DashboardAdmin")}>
            <Ionicons name="settings" size={16} color="#FFF" />
            <Text style={styles.adminButtonText}>Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Adopcion")}>
          <Ionicons name="home" size={16} color="#FF6B35" />
          <Text style={styles.navLink}>Adopción</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Transito")}>
          <Ionicons name="time" size={16} color="#FF6B35" />
          <Text style={styles.navLink}>Tránsito</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Perdidas")}>
          <Ionicons name="search" size={16} color="#FF6B35" />
          <Text style={styles.navLink}>Perdidas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("ChatUsuario")}>
          <Ionicons name="chatbubble" size={16} color="#FF6B35" />
          <Text style={styles.navLink}>Reportar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Donaciones")}>
          <Ionicons name="gift" size={16} color="#FF6B35" />
          <Text style={styles.navLink}>Donar</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.authContainer}>
        {!nombre ? (
          <>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginButtonText}>Ingresar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Registro")}>
              <Text style={styles.registerButtonText}>Registro</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.welcomeContainer}>
              <Ionicons name="person-circle" size={20} color="#FF6B35" />
              <Text style={styles.welcome}>Hola, {nombre}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
              <Ionicons name="log-out" size={16} color="#FFF" />
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F3',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 8,
  },
  navContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  navLink: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 4,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  adminButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  authContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#FFF',
    borderColor: '#FF6B35',
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#FF6B35',
    fontWeight: 'bold',
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  welcome: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default Header;

