import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ModalPublicar = ({ visible, onClose, onPublicar, nombre }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Crear Publicación</Text>
          <Text style={styles.subtitle}>Seleccione el tipo de publicación para {nombre}:</Text>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#007bff' }]} onPress={() => onPublicar('Adopción')}>
            <Text style={styles.buttonText}>Mascota en Adopción</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#17c9e2' }]} onPress={() => onPublicar('Tránsito')}>
            <Text style={styles.buttonText}>Mascota en Tránsito</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffc107' }]} onPress={() => onPublicar('Perdido')}>
            <Text style={styles.buttonText}>Mascota Perdida</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    position: 'relative'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    marginBottom: 15,
    textAlign: 'center'
  },
  button: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  close: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  closeText: {
    fontSize: 22,
    color: '#999'
  }
});

export default ModalPublicar;
