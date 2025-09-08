// src/screens/admin/chat/ChatsActivos.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatsActivos = () => {
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchChats();
  }, [isFocused]);

  const fetchChats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(
        'http://172.20.10.2/mascotas-api/endpoints/chat/obtener_chats_activos.php'
      );
      const data = await res.json();
      setChats(Array.isArray(data) ? data : data.chats || []);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudieron cargar los chats');
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatAdmin', {
          id_chat: item.id_chat,
          nombre: item.nombre,
          email: item.email
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle" size={48} color="#FF6B35" />
        <View style={styles.onlineIndicator} />
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.userName}>{item.nombre}</Text>
          <Text style={styles.timeText}>Activo</Text>
        </View>
        <Text style={styles.emailText}>{item.email}</Text>
        {item.ultimo_mensaje && (
          <Text style={styles.lastMessage} numberOfLines={2}>
            {item.ultimo_mensaje}
          </Text>
        )}
      </View>
      
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={28} color="#FFF" />
          <Text style={styles.headerTitle}>Chats Activos</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {chats.length} conversación{chats.length !== 1 ? 'es' : ''} activa{chats.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      <FlatList
        data={chats}
        keyExtractor={c => c.id_chat.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchChats}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#BDC3C7" />
            <Text style={styles.emptyTitle}>No hay chats activos</Text>
            <Text style={styles.emptyText}>Los nuevos chats aparecerán aquí</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ChatsActivos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  timeText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '600',
  },
  emailText: {
    fontSize: 13,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  arrowContainer: {
    marginLeft: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

