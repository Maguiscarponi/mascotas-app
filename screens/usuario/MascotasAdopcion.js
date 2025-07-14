import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function MascotasAdopcion({ navigation }) {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://192.168.18.24/mascotas-api/endpoints/mascotas/adopcion.php")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("❌ Error de red:", err));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: `http://192.168.18.24/mascotas/${item.imagen}` }} style={styles.image} />
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.age}>{item.edad}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("DetalleMascota", { ...item, tipo_formulario: "adopcion" })}
      >
        <Text style={styles.buttonText}>Adoptar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Mascotas en Adopción</Text>
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id_mascota.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  list: { paddingBottom: 20 },
  card: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#fef6e4",
    padding: 15,
    borderRadius: 12,
  },
  image: { width: 200, height: 200, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  age: { fontSize: 16, color: "gray" },
  button: {
    backgroundColor: '#eb5d37',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
