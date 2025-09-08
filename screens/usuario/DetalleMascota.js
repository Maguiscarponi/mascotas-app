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
    return `Informar sobre ${mascota.nombre}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `http://172.20.10.2/mascotas/${mascota.imagen}` }}
        style={styles.imagen}
      />
      <View style={styles.descripcionMascota}>
        <Text style={styles.titulo}>DESCRIPCIÓN</Text>
        {["nombre", "tipo", "genero", "raza", "tamano", "edad", "castrado", "vacunado"].map((campo) => (
          <View style={styles.fila} key={campo}>
            <Text style={styles.label}>{campo.charAt(0).toUpperCase() + campo.slice(1)}:</Text>
            <Text style={styles.valor}>{mascota[campo]}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.botonInformar} onPress={irAlFormulario}>
        <Text style={styles.botonTexto}>{getBotonTexto()}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#fff3e9", 
    padding: 20 },

  imagen: { 
    width: "100%", 
    height: 300, 
    borderRadius: 15, 
    marginBottom: 20 },

  descripcionMascota: { 
    backgroundColor: "#fff", 
    padding: 20, 
    borderRadius: 15 },

  titulo: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#2c2c2c" },

  fila: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 8 },

  label: { 
    fontWeight: "bold", 
    color: "#444" },

  valor: { 
    color: "#333" },

  botonInformar: {
    backgroundColor: "#eb5d37",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },

  botonTexto: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" },
});
