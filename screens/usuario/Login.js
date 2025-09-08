import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completá todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://172.20.10.2/mascotas-api/endpoints/auth/login.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        await AsyncStorage.setItem("id_usuario", data.id_usuario.toString());
        await AsyncStorage.setItem("nombre_usuario", data.nombre);

        if (data.rol === 'admin') {
          navigation.replace('DashboardAdmin');
        } else {
          navigation.replace('Home');
        }
      } else {
        Alert.alert('Error', data.message || 'Credenciales inválidas.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al intentar iniciar sesión.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.botonTexto}>Ingresar</Text>
      </TouchableOpacity>
      
      {/* Enlace al registro */}
      <View style={styles.registroContainer}>
        <Text style={styles.registroTexto}>¿No tenés una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
          <Text style={styles.registroLink}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#333',
    textAlign: 'center'
  },
  input: {
    borderWidth: 2,
    borderColor: '#E57C00',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16
  },
  boton: {
    backgroundColor: '#ee6c4d',
    padding: 18,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  registroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center'
  },
  registroTexto: {
    fontSize: 16,
    color: '#666'
  },
  registroLink: {
    fontSize: 16,
    color: '#ee6c4d',
    fontWeight: '600'
  }
});
