// src/screens/admin/chat/ChatAdmin.js

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  connectSocket,
  sendMessageSocket,
  subscribeToMessages
} from '../../../utils/socket';
import Mensaje from '../../../components/Mensaje';
import ImagenChat from '../../../components/ImagenChat';

const ChatAdmin = ({ route, navigation }) => {
  // Parámetros desde ChatsActivos
  const { id_chat, nombre, email } = route.params;

  //Estados principales
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [imgUri, setImgUri] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Referencia para el FlatList
  const flatRef = useRef(); //Scroll automático al final
  const insets = useSafeAreaInsets(); //para manejar el padding del teclado

  useEffect(() => {
    //Aca conecto el socket para recibir los mensajes
    connectSocket();
    // Suscribirse a los mensajes nuevos
    const unsub = subscribeToMessages(nuevo => {
      //Solo agrega mensajes que pertenezcan al chat actual
      if (Number(nuevo.chat_id) === Number(id_chat)) {
        setMensajes(prev => [...prev, nuevo]);
        scrollToEnd();
      }
    });

    // Carga inicial de mensajes
    (async () => {
      try {
        const res = await fetch(
          `http://172.20.10.2/mascotas-api/endpoints/chat/obtener_mensajes_por_chatId.php?id_chat=${id_chat}`
        );
        const data = await res.json();
        //Diferentes formatos de respuesta para la API
        setMensajes(Array.isArray(data) ? data : data.mensajes || []);
        scrollToEnd();
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    })();

    return () => unsub && unsub();
  }, []);


  //Esta funcion es para hacer scroll al final del chat de manera automática
  const scrollToEnd = () => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // Esta función sube la imagen al servidor y devuelve la URL
  const subirImagen = async uri => {
    const form = new FormData();
    const name = `chat_${Date.now()}.jpg`;
    form.append('imagen', { uri, name, type: 'image/jpeg' });
    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/subir_imagen_chat.php',
        { method: 'POST', body: form }
      );
      const json = await res.json();

      //Que retorne la URL si la imagen se subio bien y sino un string vacío
      return json.success ? json.imagen_url : '';
    } catch {
      return '';
    }
  };


  const enviarImagen = async (uri) => {
    if (enviando) return;
    
    setEnviando(true);

    //Primero subir imagen al servidor
    const remoteUrl = await subirImagen(uri);
    
    if (!remoteUrl) {
      Alert.alert('Error', 'No se pudo subir la imagen');
      setEnviando(false);
      return;
    }

    //Generar timestamp en el formato de MySQL 
    const now = new Date();
    const fecha =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
      )}:${String(now.getSeconds()).padStart(2, '0')}`;

      // Crear el cuerpo de la solicitud
    const body = {
      chat_id: id_chat,
      mensaje: '',
      imagen_url: remoteUrl,
      fecha
    };

    try {
      //Se guarda el mensaje en la base de datos
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/guardar_mensaje_admin.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
      const json = await res.json();
      if (json.success) {
        //Preparar el mensaje para mandar por socket y agregar el estado local
        const nuevoMensaje = {
          ...body,
          tipo_emisor: 'admin',
          fecha_envio: fecha
        };

        //Emite por socket para que se reciba el mensaje en tiempo real
        sendMessageSocket(nuevoMensaje);
        setMensajes(prev => [...prev, nuevoMensaje]);
        scrollToEnd();
      } else {
        Alert.alert('Error', json.message || 'No se pudo enviar');
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  const handleImagenSeleccionada = (uri) => {
    // Mostrar vista previa en lugar de mandar inmediatamente
    setImgUri(uri);
  };

  const enviar = async () => {
    if (!texto.trim() && !imgUri) return;
    if (enviando) return;
    
    setEnviando(true);
    
    // Guardar referencia a la imagen actual
    const imagenActual = imgUri;
    
    let remoteUrl = '';
    if (imagenActual) {
      // Limpiar vista previa inmediatamente
      setImgUri(null);
      
      remoteUrl = await subirImagen(imagenActual);
      if (!remoteUrl) {
        Alert.alert('Error', 'No se pudo subir la imagen');
        setEnviando(false);
        return;
      }
    }

    const now = new Date();
    const fecha =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ` +
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0'
      )}:${String(now.getSeconds()).padStart(2, '0')}`;

    const body = {
      chat_id: id_chat,
      mensaje: texto.trim(),
      imagen_url: remoteUrl,
      fecha
    };

    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/guardar_mensaje_admin.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
      const json = await res.json();
      if (json.success) {
        // Mensaje a enviar por socket y agregar localmente
        const nuevoMensaje = {
          ...body,
          tipo_emisor: 'admin',
          fecha_envio: fecha
        };
        sendMessageSocket(nuevoMensaje);
        setMensajes(prev => [...prev, nuevoMensaje]);
        setTexto('');
        scrollToEnd();
      } else {
        Alert.alert('Error', json.message || 'No se pudo enviar');
        // Si falla, restaurar la imagen
        if (imagenActual) {
          setImgUri(imagenActual);
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Error de conexión');
      // Si falla, restaurar la imagen
      if (imagenActual) {
        setImgUri(imagenActual);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FF6B35" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{nombre || email}</Text>
          <Text style={styles.headerSubtitle}>Chat de soporte</Text>
        </View>
        <View style={styles.statusIndicator}>
          <View style={styles.onlineStatus} />
        </View>
      </View>

      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Cargando mensajes...</Text>
        </View>
      ) : (
        <FlatList
          data={mensajes}
          keyExtractor={(_, i) => i.toString()}
          ref={flatRef}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToEnd}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <Mensaje item={item} isAdmin={true} />;
          }}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
      >
        {imgUri && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imgUri }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => setImgUri(null)} style={styles.removeButton}>
              <Ionicons name="close" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.imageButton}>
            <ImagenChat onImagenSeleccionada={handleImagenSeleccionada} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Escribí tu mensaje..."
            placeholderTextColor="#BDC3C7"
            value={texto}
            onChangeText={setTexto}
            returnKeyType="send"
            onSubmitEditing={enviar}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, enviando && styles.sendButtonDisabled]} 
            onPress={enviar}
            disabled={enviando}
            activeOpacity={0.8}
          >
            {enviando ? (
};

export default ChatAdmin;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF8F3' 
  },
  header: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 2,
  },
  statusIndicator: {
    alignItems: 'center',
  },
  onlineStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27AE60',
  },
  messagesList: { 
    flexGrow: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
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
  sendButtonDisabled: {
    backgroundColor: '#BDC3C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  botonDisabled: { 
    backgroundColor: '#ccc' 
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});





