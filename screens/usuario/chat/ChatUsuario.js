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
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={24} color="#FF6B35" />
          <Text style={styles.headerTitle}>Chat de Soporte</Text>
        </View>
        <Text style={styles.headerSubtitle}>Reportá o consultá sobre mascotas</Text>
      </View>
      
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.chatInner}>
            <FlatList
              data={mensajes}
              renderItem={({ item }) => <Mensaje item={item} />}
              keyExtractor={(item, i) => i.toString()}
              ref={flatListRef}
              contentContainerStyle={styles.messagesList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />

            {imageLocalUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageLocalUri }} style={styles.previewImage} />
                <TouchableOpacity onPress={() => setImageLocalUri(null)} style={styles.removeButton}>
                  <Ionicons name="close" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
              <TouchableOpacity style={styles.imageButton}>
                <ImagenChat onImagenSeleccionada={setImageLocalUri} />
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Escribí tu mensaje..."
                placeholderTextColor="#BDC3C7"
                value={mensaje}
                onChangeText={setMensaje}
                returnKeyType="send"
                onSubmitEditing={enviarMensaje}
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.sendButton} onPress={enviarMensaje} activeOpacity={0.8}>
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
};

export default ChatUsuario;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  chatInner: {
    flex: 1
  },
  messagesList: {
    flexGrow: 1,
    padding: 20,
  },
  previewContainer: {
    position: 'relative',
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E74C3C',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2C3E50',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#FF6B35',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold'
  }
});















