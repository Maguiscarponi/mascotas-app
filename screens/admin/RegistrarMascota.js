import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const RegistrarMascota = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Perro');
  const [genero, setGenero] = useState('Macho');
  const [raza, setRaza] = useState('');
  const [tamano, setTamano] = useState('Chico');
  const [edad, setEdad] = useState('');
  const [castrado, setCastrado] = useState('No');
  const [vacunado, setVacunado] = useState('No');
  const [estado, setEstado] = useState('Adopción');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Necesitamos permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagen(result.assets[0]);
    }
  };

  const registrarMascota = async () => {
    if (enviando) return; // Evito múltiples envíos
    
    if (!nombre || !raza || !edad || !imagen) {
      Alert.alert('Error', 'Completa todos los campos y selecciona una imagen');
      return;
    }

    setEnviando(true);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('tipo', tipo);
    formData.append('genero', genero);
    formData.append('raza', raza);
    formData.append('tamano', tamano);
    formData.append('edad', edad);
    formData.append('castrado', castrado);
    formData.append('vacunado', vacunado);
    formData.append('estado', estado);
    formData.append('descripcion', descripcion);
    
    formData.append('imagen', {
      uri: imagen.uri,
      type: 'image/jpeg',
      name: 'imagen.jpg',
    });

    try {
      const response = await fetch('http://192.168.18.24/mascotas-api/endpoints/mascotas/registrar_mascotas.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        Alert.alert('Éxito', 'Mascota registrada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Error al registrar');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al servidor');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nueva Mascota</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre de la mascota"
      />

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

      <Text style={styles.label}>Raza</Text>
      <TextInput
        style={styles.input}
        value={raza}
        onChangeText={setRaza}
        placeholder="Raza"
      />

      <Text style={styles.label}>Tamaño</Text>
      <Picker selectedValue={tamano} onValueChange={setTamano} style={styles.picker}>
        <Picker.Item label="Chico" value="Chico" />
        <Picker.Item label="Mediano" value="Mediano" />
        <Picker.Item label="Grande" value="Grande" />
      </Picker>

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        value={edad}
        onChangeText={setEdad}
        placeholder="Edad"
      />

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

      <TouchableOpacity style={styles.btnSeleccionar} onPress={seleccionarImagen}>
        <Text style={styles.btnText}>Seleccionar Imagen</Text>
      </TouchableOpacity>

      {imagen && <Image source={{ uri: imagen.uri }} style={styles.preview} />}

      <TouchableOpacity 
        style={styles.btnGuardar} 
        onPress={registrarMascota}
        disabled={enviando}
      >
        <Text style={styles.btnText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  picker: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  btnSeleccionar: {
    marginTop: 15,
    backgroundColor: '#f28c38',
    paddingVertical: 10,
    borderRadius: 5,
  },
  btnGuardar: {
    marginTop: 30,
    marginBottom: 50,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 5,
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
});

export default RegistrarMascota;

