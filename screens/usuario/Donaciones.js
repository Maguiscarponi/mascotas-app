// screens/usuario/Donaciones.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Donaciones() {
  const handleDonate = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error al abrir URL:', err)
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner de donaciones */}
        <View style={styles.heroSection}>
          <Image
            source={require('../../assets/donaciones.png')}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Ayudanos a seguir ayudando</Text>
            <Text style={styles.heroSubtitle}>
              ¡Tu aporte marca la diferencia en la vida de cientos de mascotas!
            </Text>
          </View>
        </View>

        {/* Opciones de donación */}
        <View style={styles.optionsContainer}>
          {/* Transferencia Bancaria */}
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="university" size={48} color="#e76f51" />
            </View>
            <Text style={styles.cardTitle}>Transferencia Bancaria</Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Alias: </Text>adoptame.saladillo
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>CBU: </Text>0000003100031234567890
            </Text>
            <Text style={styles.cardText}>
              <Text style={styles.label}>Titular: </Text>Asociación Adoptame Saladillo
            </Text>
          </View>

          {/* Mercado Pago */}
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="credit-card" size={48} color="#e76f51" />
            </View>
            <Text style={styles.cardTitle}>Mercado Pago</Text>
            <Text style={[styles.cardText, { marginBottom: 16 }]}>
              Hacé tu donación fácil y rápida con un solo clic
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                handleDonate('https://mpago.la/2ezEmb5')
              }
            >
              <Text style={styles.buttonText}>Donar con Mercado Pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingBottom: 20,
  },
  heroSection: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e76f51',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#e76f51',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

