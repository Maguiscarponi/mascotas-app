import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FormularioAdopcion() {
  const route = useRoute();
  const { id_mascota, nombre_mascota } = route.params;

  useEffect(() => {
    const verificarStorage = async () => {
      const id = await AsyncStorage.getItem('id_usuario');
      console.log(">>> id_usuario en AsyncStorage:", id);
      const userData = await AsyncStorage.getItem('userData');
      console.log(">>> userData en AsyncStorage:", userData);
    };
  
    verificarStorage();
  }, []);

  const [id_usuario, setIdUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    direccion: "",
    experiencia_previa: "",
    acepta_visita: "",
    tipo_vivienda: ""
  });

  useEffect(() => {
    const cargarIdUsuario = async () => {
      try {
        const id = await AsyncStorage.getItem('id_usuario');
        console.log("id_usuario leído de AsyncStorage:", id);
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

    const { nombre_completo, email, telefono, direccion, experiencia_previa, acepta_visita, tipo_vivienda } = form;

    if (!nombre_completo || !email || !telefono || !direccion || !experiencia_previa || !acepta_visita || !tipo_vivienda) {
      Alert.alert("Error", "Por favor, complete todos los campos obligatorios.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor, ingrese un email válido.");
      return;
    }

    const datos = {
      ...form,
      id_usuario: id_usuario,
      id_mascota: id_mascota,
      nombre_mascota: nombre_mascota
    };

    console.log("Datos enviados:", datos);

    fetch("http://172.20.10.2/mascotas-api/endpoints/solicitudes/registrar_adopcion.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          Alert.alert("¡Gracias!", "Formulario de adopción enviado correctamente.");
        } else {
          Alert.alert("Error", data.message || "No se pudo enviar el formulario.");
        }
      })
      .catch((error) => {
        console.error("Error al enviar:", error);
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
      <Text style={styles.title}>Formulario de Adopción</Text>
      <TextInput placeholder="Nombre completo" style={styles.input} onChangeText={t => handleChange("nombre_completo", t)} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={t => handleChange("email", t)} />
      <TextInput placeholder="Teléfono" style={styles.input} onChangeText={t => handleChange("telefono", t)} />
      <TextInput placeholder="Dirección" style={styles.input} onChangeText={t => handleChange("direccion", t)} />
      {renderRadioGroup("¿Tiene experiencia previa en el cuidado de mascotas?", "experiencia_previa", ["Si", "No"])}
      {renderRadioGroup("¿Acepta una visita previa a la adopción?", "acepta_visita", ["Si", "No"])}
      {renderRadioGroup("Condiciones de vivienda", "tipo_vivienda", ["Casa con patio", "Casa sin patio", "Departamento chico", "Departamento grande"])}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar solicitud</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  function renderRadioGroup(label, name, options) {
    return (
      <View style={styles.radioGroup}>
        <Text style={styles.label}>{label}</Text>
        {options.map(opt => (
          <TouchableOpacity key={opt} style={styles.radioOption} onPress={() => handleChange(name, opt)}>
            <Text style={[styles.radio, form[name] === opt && styles.radioSelected]}>
              {form[name] === opt ? "●" : "○"}
            </Text>
            <Text>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 12, padding: 10 },
  button: { backgroundColor: "#eb5d37", padding: 12, borderRadius: 10, marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  radioGroup: { marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: "bold" },
  radioOption: { flexDirection: "row", alignItems: "center", marginBottom: 5, gap: 8 },
  radio: { fontSize: 18 },
  radioSelected: { color: "#eb5d37" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});






