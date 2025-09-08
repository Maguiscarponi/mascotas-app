import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Menu, TouchableRipple, Provider } from 'react-native-paper';

const DropMenu = ({ label, value, options, onSelect }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.dropdownWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableRipple onPress={() => setVisible(true)} style={styles.dropdown}>
            <Text>{value}</Text>
          </TouchableRipple>
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
            title={option}
          />
        ))}
      </Menu>
    </View>
  );
};

//Pantalla para editar una mascota (cuando vendo desde RegistrarMascota.js)
const EditarMascota = ({ route, navigation }) => {
  const { mascota, onUpdate } = route.params; 

  //Estados para cada campo del form, con valores iniciales cargados desde la mascota
  const [nombre, setNombre] = useState(mascota.nombre);
  const [tipo, setTipo] = useState(mascota.tipo || 'Perro');
  const [genero, setGenero] = useState(mascota.genero || 'Macho');
  const [raza, setRaza] = useState(mascota.raza || '');
  const [tamano, setTamano] = useState(mascota.tamano || 'Chico');
  const [edad, setEdad] = useState(mascota.edad || '');
  const [castrado, setCastrado] = useState(mascota.castrado || 'Sí');
  const [vacunado, setVacunado] = useState(mascota.vacunado || 'Sí');
  const [estado, setEstado] = useState(mascota.estado || 'Adopción');

  // Función para guardar cambios al editar la mascota y los mando a la bdd
  const handleGuardar = async () => {
    try {
      const response = await fetch('http://172.20.10.2/mascotas-api/endpoints/mascotas/editar_mascota.php', {
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

          // Si hay una función onUpdate, (desde mascotas Registradas) la llamo para actualizar la lista
          if (onUpdate) {
            onUpdate();
          }

          // Se vuelve atrás en la navegación
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
    <Provider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.titulo}>Editar Mascota</Text>

          <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />

          <DropMenu label="Tipo" value={tipo} options={["Perro", "Gato", "Otro"]} onSelect={setTipo} />

          <DropMenu label="Género" value={genero} options={["Macho", "Hembra"]} onSelect={setGenero} />

          <TextInput style={styles.input} placeholder="Raza" value={raza} onChangeText={setRaza} />

          <DropMenu label="Tamaño" value={tamano} options={["Chico", "Mediano", "Grande"]} onSelect={setTamano} />

          <TextInput style={styles.input} placeholder="Edad" value={edad} onChangeText={setEdad} />

          <DropMenu label="Castrado" value={castrado} options={["Sí", "No"]} onSelect={setCastrado} />

          <DropMenu label="Vacunado" value={vacunado} options={["Sí", "No"]} onSelect={setVacunado} />

          <DropMenu label="Estado" value={estado} options={["Adopción", "Tránsito", "Perdido"]} onSelect={setEstado} />

          <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
            <Text style={styles.btnText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#fff' },

  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20 },

  label: { 
    marginTop: 10, 
    fontWeight: 'bold' },

  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    padding: 10, 
    marginTop: 5, 
    marginBottom: 10
  },

  dropdownWrapper: { 
    marginBottom: 15 },

  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9'
  },

  btnGuardar: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
  },

  btnText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' },
});

export default EditarMascota;
