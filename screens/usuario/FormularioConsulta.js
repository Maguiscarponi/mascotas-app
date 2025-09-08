import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FormularioContacto() {
  const route = useRoute();
  const { id_mascota, nombre } = route.params;

  const [id_usuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    ubicacion_vista: "",
    fecha_vista: "",
    informacion_adicional: ""
  });

  useEffect(() => {
    const cargarIdUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('id_usuario');
        if (id) {
          setIdUsuario(parseInt(id));
        }
      } catch (error) {
        console.error('Error cargando id_usuario', error);
      } finally {
        setLoading(false);
      }
    };
    cargarIdUsuario();
  }, []);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleSubmit = () => {
    if (!id_usuario) {
      Alert.alert("Error", "No se pudo identificar el usuario. Intente iniciar sesión nuevamente.");
      return;
    }

    const { nombre_completo, email, telefono, ubicacion_vista, fecha_vista, informacion_adicional } = form;

    if (!nombre_completo || !email || !telefono || !ubicacion_vista || !fecha_vista || !informacion_adicional) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor, ingrese un email válido.");
      return;
    }

    const fechaRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!fechaRegex.test(fecha_vista)) {
      Alert.alert("Error", "Por favor, ingrese una fecha válida en formato dd/mm/aaaa.");
      return;
    }

    const datos = {
      id_usuario,
      id_mascota,
      nombre_completo,
      email,
      telefono,
      ubicacion_vista,
      fecha_vista,
      informacion_adicional
    };

    console.log("Datos enviados:", datos);

    fetch("http://172.20.10.2/mascotas-api/endpoints/solicitudes/registrar_contacto.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        console.log("Respuesta completa:", data);
        if (data && data.success) {
          Alert.alert("¡Gracias!", "Formulario de contacto enviado correctamente.");
        } else {
          Alert.alert("Error", data?.message || "No se pudo enviar el formulario.");
        }
      })
      .catch((error) => {
        console.error("Error FETCH:", error);
        Alert.alert("Error", "No se pudo enviar el formulario.");
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#eb5d37" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¿Viste a {nombre}?</Text>
      <TextInput placeholder="Nombre y apellido" style={styles.input} onChangeText={t => handleChange("nombre_completo", t)} />
      <TextInput placeholder="Correo electrónico" style={styles.input} onChangeText={t => handleChange("email", t)} />
      <TextInput placeholder="Número de teléfono" style={styles.input} onChangeText={t => handleChange("telefono", t)} />
      <TextInput placeholder="¿Dónde viste a la mascota?" style={styles.input} onChangeText={t => handleChange("ubicacion_vista", t)} />
      <TextInput placeholder="¿Cuándo la viste? (dd/mm/aaaa)" style={styles.input} onChangeText={t => handleChange("fecha_vista", t)} />
      <TextInput
        placeholder="Información adicional"
        style={[styles.input, { height: 100 }]}
        onChangeText={t => handleChange("informacion_adicional", t)}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar información</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 12, padding: 10 },
  button: { backgroundColor: "#eb5d37", padding: 12, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});




