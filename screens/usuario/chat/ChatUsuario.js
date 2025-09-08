import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet,
  KeyboardAvoidingView, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Platform,
  SafeAreaView, 
  Image, 
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { connectSocket, sendMessageSocket, subscribeToMessages } from '../../../utils/socket';
import Mensaje from '../../../components/Mensaje';
import ImagenChat from '../../../components/ImagenChat';

const ChatUsuario = () => {
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [imageLocalUri, setImageLocalUri] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const flatListRef = useRef();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Conectamos el socket y nos suscribimos a mensajes entrantes
    connectSocket();
    const unsub = subscribeToMessages(nuevo => {
      setMensajes(prev => [...prev, nuevo]);
      scrollToEnd();
    });

    // Obtener ID de usuario y cargar mensajes iniciales
    (async () => {
      const id = await AsyncStorage.getItem('id_usuario');
      const num = Number(id?.trim());
      setIdUsuario(num);
      try {
        const res = await fetch(`http://172.20.10.2/mascotas-api/endpoints/chat/obtener_mensajes_por_chat.php?id_usuario=${num}`);
        const data = await res.json();
        if (data.success) {
          setMensajes(data.mensajes);
          scrollToEnd();
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => unsub && unsub();
  }, []);

  const scrollToEnd = () => {
    // Desplazar al final del FlatList
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const uploadImage = async uri => {
    const nombre = `chat_img_${Date.now()}.jpg`;
    const data = new FormData();
    data.append('imagen', { uri, name: nombre, type: 'image/jpeg' });
    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/subir_imagen_chat.php',
        { method: 'POST', body: data }
      );
      const json = await res.json();
      return json.success ? json.imagen_url : '';
    } catch (e) {
      console.error('Error subiendo imagen:', e);
      return '';
    }
  };

  const enviarMensaje = async () => {
    if (!mensaje.trim() && !imageLocalUri) return;

    // Subir imagen si existe y obtener URL
    let remoteUrl = "";
    if (imageLocalUri) {
      remoteUrl = await uploadImage(imageLocalUri);
    }

    // Formatear fecha
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} `
                + `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    const nuevo = {
      emisor: idUsuario,
      mensaje: mensaje.trim(),
      tipo_emisor: 'usuario',
      fecha,
      imagen_url: remoteUrl
    };

    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/guardar_mensaje_usuario.php',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevo) }
      );
      const json = await res.json();
      if (json.success) {
        // Emitir por WebSocket y actualizar estado local
        sendMessageSocket(nuevo);
        setMensajes(prev => [...prev, nuevo]);
        setMensaje('');
        setImageLocalUri(null);
        scrollToEnd();
      } else {
        Alert.alert('Error', json.message || 'No se pudo enviar');
      }
    } catch (e) {
      console.error('Error al enviar:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <FlatList
              data={mensajes}
              renderItem={({ item }) => <Mensaje item={item} />}
              keyExtractor={(item, i) => i.toString()}
              ref={flatListRef}
              contentContainerStyle={styles.chatContainer}
              keyboardShouldPersistTaps="handled"
            />

            {imageLocalUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageLocalUri }} style={styles.previewImage} />
                <TouchableOpacity onPress={() => setImageLocalUri(null)} style={styles.removePreview}>
                  <Text style={styles.removePreviewText}>X</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
              <ImagenChat onImagenSeleccionada={setImageLocalUri} />
              <TextInput
                style={styles.input}
                placeholder="Escribí tu mensaje..."
                value={mensaje}
                onChangeText={setMensaje}
                returnKeyType="send"
                onSubmitEditing={enviarMensaje}
              />
              <TouchableOpacity style={styles.boton} onPress={enviarMensaje}>
                <Text style={styles.botonTexto}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatUsuario;

const styles = StyleSheet.create({
  // Estilos generales
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  container: {
    flex: 1
  },
  innerContainer: {
    flex: 1
  },

  // Contenedor del chat
  chatContainer: {
    flexGrow: 1,
    padding: 10
  },

  // Vista previa de imagen adjunta
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8
  },
  removePreview: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ddd',
    borderRadius: 10,
    padding: 2
  },
  removePreviewText: {
    fontSize: 12,
    color: '#333'
  },

  // Input de texto y botón de enviar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 8,
    borderRadius: 8,
    paddingHorizontal: 8
  },
  input: {
    flex: 1,
    height: 40
  },
  boton: {
    backgroundColor: '#ee6c4d',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold'
  }
});















