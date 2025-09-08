// src/screens/admin/chat/ChatsActivos.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const ChatsActivos = () => {
  const [chats, setChats] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchChats();
  }, [isFocused]);

  const fetchChats = async () => {
    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/obtener_chats_activos.php'
      );
      const data = await res.json();
      setChats(Array.isArray(data) ? data : data.chats || []);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar los chats');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate('ChatAdmin', {
          id_chat: item.id_chat,
          nombre: item.nombre,
          email: item.email
        })
      }
    >
      <Text style={styles.nombreText}>{item.nombre}</Text>
      <Text style={styles.emailText}>{item.email}</Text>
      {item.ultimo_mensaje ? (
        <Text style={styles.ultimoText}>{item.ultimo_mensaje}</Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats Activos</Text>
      </View>
      <FlatList
        data={chats}
        keyExtractor={c => c.id_chat.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default ChatsActivos;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8E7'
  },
  header: {
    backgroundColor: '#ee6c4d',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600'
  },
  listContent: {
    padding: 8,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    margin: 8
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ee6c4d',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FFF'
  },
  nombreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000'
  },
  emailText: {
    fontSize: 14,
    color: '#555',
    marginTop: 2
  },
  ultimoText: {
    fontSize: 14,
    color: '#333',
    marginTop: 6
  }
});

