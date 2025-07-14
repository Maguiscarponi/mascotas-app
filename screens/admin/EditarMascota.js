
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const EditarMascota = ({ route, navigation }) => {
  const { mascota } = route.params;

  const [nombre, setNombre] = useState(mascota.nombre);
  const [tipo, setTipo] = useState(mascota.tipo || 'Perro');
  const [genero, setGenero] = useState(mascota.genero || 'Macho');
  const [raza, setRaza] = useState(mascota.raza || '');
  const [tamano, setTamano] = useState(mascota.tamano || 'Chico');
  const [edad, setEdad] = useState(mascota.edad || '');
  const [castrado, setCastrado] = useState(mascota.castrado || 'Sí');
  const [vacunado, setVacunado] = useState(mascota.vacunado || 'Sí');
  const [estado, setEstado] = useState(mascota.estado || 'Adopción');

  const handleGuardar = async () => {
    try {
      const response = await fetch('http://192.168.18.24/mascotas-api/endpoints/mascotas/editar_mascota.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_mascota: mascota.id_mascota,
          nombre,
          tipo,
          genero,
          raza,
          tamano,
          edad,
          castrado,
          vacunado,
          estado
        }),
      });

      const text = await response.text();

      try {
        const data = JSON.parse(text);
        if (data.success) {
          Alert.alert('Éxito', 'Mascota actualizada correctamente');
          navigation.goBack();
        } else {
          Alert.alert('Error', data.message || 'No se pudo actualizar');
        }
      } catch (e) {
        console.error("Respuesta no JSON:", text);
        Alert.alert("Error", "Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Mascota</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <Text style={styles.label}>Tipo</Text>
      <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
        <Picker.Item label="Perro" value="Perro" />
        <Picker.Item label="Gato" value="Gato" />
        <Picker.Item label="Otro" value="Otro" />
      </Picker>

      <Text style={styles.label}>Género</Text>
      <Picker selectedValue={genero} onValueChange={setGenero} style={styles.picker}>
        <Picker.Item label="Macho" value="Macho" />
        <Picker.Item label="Hembra" value="Hembra" />
      </Picker>

      <TextInput style={styles.input} placeholder="Raza" value={raza} onChangeText={setRaza} />

      <Text style={styles.label}>Tamaño</Text>
      <Picker selectedValue={tamano} onValueChange={setTamano} style={styles.picker}>
        <Picker.Item label="Chico" value="Chico" />
        <Picker.Item label="Mediano" value="Mediano" />
        <Picker.Item label="Grande" value="Grande" />
      </Picker>

      <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} />

      <Text style={styles.label}>Castrado</Text>
      <Picker selectedValue={castrado} onValueChange={setCastrado} style={styles.picker}>
        <Picker.Item label="Sí" value="Sí" />
        <Picker.Item label="No" value="No" />
      </Picker>

      <Text style={styles.label}>Vacunado</Text>
      <Picker selectedValue={vacunado} onValueChange={setVacunado} style={styles.picker}>
        <Picker.Item label="Sí" value="Sí" />
        <Picker.Item label="No" value="No" />
      </Picker>

      <Text style={styles.label}>Estado</Text>
      <Picker selectedValue={estado} onValueChange={setEstado} style={styles.picker}>
        <Picker.Item label="Adopción" value="Adopción" />
        <Picker.Item label="Tránsito" value="Tránsito" />
        <Picker.Item label="Perdido" value="Perdido" />
      </Picker>

      <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
        <Text style={styles.btnText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginTop: 5, marginBottom: 10
  },
  picker: {
    height: 50, width: '100%', marginBottom: 10
  },
  btnGuardar: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
  },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default EditarMascota;