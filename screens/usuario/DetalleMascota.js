import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function DetalleMascota() {
  const navigation = useNavigation();
  const route = useRoute();
  const mascota = route.params;
  const { tipo_formulario } = mascota;

  const irAlFormulario = () => {
    if (tipo_formulario === "adopcion") {
      navigation.navigate("FormularioAdopcion", { 
        id_mascota: mascota.id_mascota, 
        nombre_mascota: mascota.nombre,
        id_usuario: mascota.id_usuario  
      });
    } else if (tipo_formulario === "transito") {
      navigation.navigate("FormularioTransito", { 
        id_mascota: mascota.id_mascota,
        id_usuario: mascota.id_usuario
      });
    } else {
      navigation.navigate("FormularioConsulta", { 
        id_mascota: mascota.id_mascota, 
        nombre: mascota.nombre,
        id_usuario: mascota.id_usuario
      });
    }
  };
  

  const getBotonTexto = () => {
    if (tipo_formulario === "adopcion") return "Enviar formulario de Adopción";
    if (tipo_formulario === "transito") return "Enviar formulario de Tránsito";
    return `Consultar por ${mascota.nombre}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `http://192.168.18.24/mascotas/${mascota.imagen}` }}
        style={styles.image}
      />
      <View style={styles.infoBox}>
        <Text style={styles.title}>DESCRIPCIÓN</Text>
        {["nombre", "tipo", "genero", "raza", "tamano", "edad", "castrado", "vacunado"].map((campo) => (
          <View style={styles.row} key={campo}>
            <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</Text>
            <Text style={styles.value}>{mascota[campo]}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={irAlFormulario}>
        <Text style={styles.buttonText}>{getBotonTexto()}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff3e9", padding: 20 },
  image: { width: "100%", height: 300, borderRadius: 15, marginBottom: 20 },
  infoBox: { backgroundColor: "#fff", padding: 20, borderRadius: 15 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#2c2c2c" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontWeight: "bold", color: "#444" },
  value: { color: "#333" },
  button: {
    backgroundColor: "#eb5d37",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
