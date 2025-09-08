import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={[styles.messageContainer, esPropio ? styles.ownMessage : styles.otherMessage]}>
      {!esPropio && (
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={32} color="#7F8C8D" />
        </View>
      )}
      
      <View style={[styles.messageBubble, esPropio ? styles.ownBubble : styles.otherBubble]}>
        {tieneImagen && (
          <Image
            source={{
              uri: item.imagen_url.startsWith('http')
                ? item.imagen_url
                : `http://172.20.10.2/mascotas/${item.imagen_url}`
            }}
            style={styles.messageImage}
            resizeMode="cover"
            onError={(e) => console.log('Error cargando imagen:', item.imagen_url, e.nativeEvent.error)}
          />
        )}
        {tieneMensaje && (
          <Text style={[styles.messageText, esPropio ? styles.ownText : styles.otherText]}>
            {item.mensaje}
          </Text>
        )}
        <Text style={[styles.timeText, esPropio ? styles.ownTime : styles.otherTime]}>
          {hora}
        </Text>
      </View>
      
      {esPropio && (
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={32} color="#FF6B35" />
        </View>
      )}
    </View>
  );
};

export default Mensaje;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  ownBubble: {
    backgroundColor: '#FF6B35',
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFF',
  },
  otherText: {
    color: '#2C3E50',
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  ownTime: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  otherTime: {
    color: '#7F8C8D',
    textAlign: 'left',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 8,
  },
});

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








