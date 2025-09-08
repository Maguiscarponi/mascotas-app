import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Text style={styles.logo}>Adoptame Saladillo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navContainer}>

          {rol === "admin" && (
          <TouchableOpacity onPress={() => navigation.navigate("DashboardAdmin")}>
            <Text style={[styles.navLink, { fontWeight: 'bold', color: '#d44b2e' }]}>Panel administrativo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Adopcion")}>
          <Text style={styles.navLink}>Mascotas en Adopción</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Transito")}>
          <Text style={styles.navLink}>Mascotas en Tránsito</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Perdidas")}>
          <Text style={styles.navLink}>Mascotas Perdidas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("ChatUsuario")}>
          <Text style={styles.navLink}>Reportar Mascota</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate("Donaciones")}>
          <Text style={styles.navLink}>Realizar Donación</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.authContainer}>
        {!nombre ? (
          <>
            <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate("Login")}>
              <Text style={styles.authButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate("Registro")}>
              <Text style={styles.authButtonText}>Registrarse</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.welcome}>Bienvenido, {nombre}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
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
    backgroundColor: '#FFEFE2',
    paddingTop: 50,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'column',
    alignItems: 'center',
    elevation: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
  },
  navContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  authContainer: {
    marginTop: 15,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  authButton: {
    borderColor: '#eb5d37',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  authButtonText: {
    color: '#eb5d37',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#E56342',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  welcome: {
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Header;

