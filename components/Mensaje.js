import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Mensaje = ({ item, isAdmin = false }) => {
  // Lógica corregida para determinar si el mensaje es propio
  const esPropio = isAdmin 
    ? item.tipo_emisor === 'admin'  // En vista admin: admin = derecha
    : item.tipo_emisor === 'usuario'; // En vista usuario: usuario = derecha
    
  const fecha = item.fecha_envio || item.fecha || '';
  const parsearFechaComoLocal = fechaStr => {
    const partes = fechaStr.split(/[- :]/);
    const anio = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1;
    const dia = parseInt(partes[2]);
    const hora = parseInt(partes[3]);
    const minuto = parseInt(partes[4]);
    const fechaLocal = new Date(anio, mes, dia, hora, minuto);
    return fechaLocal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const hora = fecha ? parsearFechaComoLocal(fecha) : '';
  const tieneImagen = item.imagen_url && item.imagen_url !== '' && item.imagen_url !== 'null';
  const tieneMensaje = item.mensaje && item.mensaje !== 'null' && item.mensaje !== '';
  
  // Si no tiene ni imagen ni mensaje, no renderizar nada
  if (!tieneImagen && !tieneMensaje) {
    return null;
  }

  return (
    <View style={[styles.mensaje, esPropio ? styles.derecha : styles.izquierda]}>
      {tieneImagen && (
        <Image
          source={{
            uri: item.imagen_url.startsWith('http')
              ? item.imagen_url
              : `http://172.20.10.2/mascotas/${item.imagen_url}`
          }}
          style={styles.imagen}
          resizeMode="cover"
          onError={(e) => console.log('Error cargando imagen:', item.imagen_url, e.nativeEvent.error)}
        />
      )}
      {tieneMensaje && (
        <Text style={styles.texto}>{item.mensaje}</Text>
      )}
      <Text style={styles.fecha}>{hora}</Text>
    </View>
  );
};

export default Mensaje;

const styles = StyleSheet.create({
  mensaje: {
    maxWidth: '75%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10
  },
  derecha: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7ff',
    borderTopRightRadius: 0
  },
  izquierda: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    borderTopLeftRadius: 0
  },
  texto: {
    fontSize: 16,
    color: '#000'
  },
  fecha: {
    fontSize: 10,
    color: '#555',
    marginTop: 4,
    textAlign: 'right'
  },
  imagen: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 6,
    resizeMode: 'cover'
  }
});








