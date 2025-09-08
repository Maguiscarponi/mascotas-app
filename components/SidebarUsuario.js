import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function SidebarUsuario() {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.frase}>
        Conectando corazones con patitas desde Saladillo
      </Text>

      <View style={styles.redes}>
        <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
          <FontAwesome name="facebook" size={24} color="#3b5998" style={styles.icono} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
          <FontAwesome name="instagram" size={24} color="#E1306C" style={styles.icono} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/5491123456789')}>
          <FontAwesome name="whatsapp" size={24} color="#25D366" style={styles.icono} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#fff4e6',
    padding: 20,
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 15,
  },
  frase: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  redes: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
  },
  icono: {
    marginHorizontal: 10,
  },
});
