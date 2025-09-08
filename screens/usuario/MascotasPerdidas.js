import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../../components/Header";

export default function MascotasPerdidas({ navigation }) {
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    fetch("http://172.20.10.2/mascotas-api/endpoints/mascotas/perdidos.php")
      .then(res => res.json())
      .then(data => setMascotas(data))
      .catch(err => console.error("❌ Error de red:", err));
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <Image source={{ uri: `http://172.20.10.2/mascotas/${item.imagen}` }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.edad}>{item.edad}</Text>
      <TouchableOpacity
        style={styles.botonpreguntar}
        onPress={() => navigation.navigate("DetalleMascota", { ...item, tipo_formulario: "consulta" })}
      >
        <Text style={styles.botontexto}>Tengo información de {item.nombre}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={mascotas}
        keyExtractor={(item) => item.id_mascota.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  
  lista: { 
    paddingTop: 20,
    paddingBottom: 20 },

  tarjeta: {
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#fef6e4",
    padding: 15,
    borderRadius: 12,
  },

  imagen: { 
    width: 200, 
    height: 200, 
    borderRadius: 10, 
    marginBottom: 10 },

  nombre: { 
    fontSize: 18, 
    fontWeight: "bold" },

  edad: { 
    fontSize: 16, 
    color: "gray" },

  botonpreguntar: {
    backgroundColor: '#eb5d37',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },

  botontexto: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
