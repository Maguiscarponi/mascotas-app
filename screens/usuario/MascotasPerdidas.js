import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Header from "../../components/Header";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MascotasPerdidas({ navigation }) {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://172.20.10.2/mascotas-api/endpoints/mascotas/perdidos.php")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("❌ Error de red:", err));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate("DetalleMascota", { ...item, tipo_formulario: "consulta" })}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: `http://172.20.10.2/mascotas/${item.imagen}` }} style={styles.imagen} />
        <View style={styles.lostBadge}>
          <Ionicons name="search" size={16} color="#E74C3C" />
        </View>
        <View style={styles.urgentLabel}>
          <Text style={styles.urgentText}>PERDIDO</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#7F8C8D" />
          <Text style={styles.edad}>{item.edad}</Text>
        </View>
        
        <View style={styles.infoButton}>
          <Ionicons name="information-circle" size={16} color="#FFF" />
          <Text style={styles.infoButtonText}>Tengo Info</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Mascotas Perdidas</Text>
        <Text style={styles.pageSubtitle}>Ayúdanos a reunirlas con sus familias</Text>
      </View>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id_mascota.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 60) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  imagen: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  lostBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 15,
  },
  nombre: { 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  edad: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  infoButton: {
    flexDirection: 'row',
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  infoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});
