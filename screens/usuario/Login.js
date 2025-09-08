import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={40} color="#FF6B35" />
          <Text style={styles.logoText}>AdoptaAR</Text>
        </View>
        <Text style={styles.welcomeText}>¡Bienvenido de vuelta!</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#BDC3C7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7F8C8D" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#BDC3C7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.boton} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.botonTexto}>Ingresar</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" style={styles.buttonIcon} />
        </TouchableOpacity>
        
        <View style={styles.registroContainer}>
          <Text style={styles.registroTexto}>¿No tenés una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.registroLink}>Registrate aquí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 18,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1.2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#2C3E50',
  },
  boton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  botonTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  registroTexto: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  registroLink: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
});
