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
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        </TouchableOpacity>
        <Text style={styles.title}>{nombre || email}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Lista de chat */}
      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0084ff" />
        </View>
      ) : (
        <FlatList
          data={mensajes}
          keyExtractor={(_, i) => i.toString()}
          ref={flatRef}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={scrollToEnd}
          renderItem={({ item }) => {
            // Pasar isAdmin=true para que el componente Mensaje maneje correctamente la lógica
            return <Mensaje item={item} isAdmin={true} />;
          }}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}
      >
        {/* Vista previa de imagen */}
        {imgUri && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imgUri }} style={styles.previewImage} />
            <TouchableOpacity onPress={() => setImgUri(null)} style={styles.removePreview}>
              <Text style={styles.removePreviewText}>X</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
          <ImagenChat onImagenSeleccionada={handleImagenSeleccionada} />
          <TextInput
            style={styles.input}
            placeholder="Escribí tu mensaje..."
            value={texto}
            onChangeText={setTexto}
            returnKeyType="send"
            onSubmitEditing={enviar}
          />
          <TouchableOpacity 
            style={[styles.boton, enviando && styles.botonDisabled]} 
            onPress={enviar}
            disabled={enviando}
          >
            <Text style={styles.botonTexto}>{enviando ? '...' : 'Enviar'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatAdmin;

const styles = StyleSheet.create({
  // Igual fondo que ChatUsuario
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f0f0f0' 
  },

  // Mantener el header pero con estilo neutro que no desentone
  header: {
    height: 56,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  back: { 
    color: '#ee6c4d', 
    fontSize: 16 
  },
  title: { 
    color: '#333', 
    fontSize: 18, 
    fontWeight: '600' 
  },

  // Igual que en ChatUsuario: padding y flexGrow para que el FlatList crezca
  chatContainer: { 
    padding: 10, 
    flexGrow: 1 
  },

  // Vista previa de imagen idéntica
  previewContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    backgroundColor: '#fff', 
    marginHorizontal: 8, 
    borderRadius: 8, 
    marginBottom: 4 
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

  // Input area igual que ChatUsuario
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





