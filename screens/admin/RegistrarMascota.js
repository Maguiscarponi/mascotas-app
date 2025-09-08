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
import * as ImagePicker from 'expo-image-picker';
import { Menu, TouchableRipple, Provider } from 'react-native-paper';

// Componente para menús desplegables modernos
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
            <Text style={styles.dropdownText}>{value || `Seleccionar ${label}`}</Text>
          </TouchableRipple>
        }
        contentStyle={styles.menuContent}
      >
        {options.map((option) => (
          <Menu.Item
            key={option}
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
            title={option}
            titleStyle={styles.menuItemText}
          />
        ))}
      </Menu>
    </View>
  );
};

const RegistrarMascota = ({ navigation }) => {
  // Estados para todos los campos del formulario
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('Perro');
  const [genero, setGenero] = useState('Macho');
  const [raza, setRaza] = useState('');
  const [tamano, setTamano] = useState('Chico');
  const [edad, setEdad] = useState('');
  const [castrado, setCastrado] = useState('No');
  const [vacunado, setVacunado] = useState('No');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState('');


  // Función para seleccionar imagen de la galería
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Necesitamos permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagen(result.assets[0]);
    }
  };

  // Función para registrar mascota
  const registrarMascota = async () => {
    if (enviando) return;

    // Validación de campos obligatorios
    if (!nombre.trim() || !raza.trim() || !edad.trim() || !imagen) {
      Alert.alert('Error', 'Por favor completá todos los campos obligatorios y seleccioná una imagen');
      return;
    }

    setEnviando(true);

    // Preparar FormData para envío
    const formData = new FormData();
    formData.append('nombre', nombre.trim());
    formData.append('tipo', tipo);
    formData.append('genero', genero);
    formData.append('raza', raza.trim());
    formData.append('tamano', tamano);
    formData.append('edad', edad.trim());
    formData.append('castrado', castrado);
    formData.append('vacunado', vacunado);
    formData.append('descripcion', descripcion.trim());
    formData.append('estado', estado);

    formData.append('imagen', {
      uri: imagen.uri,
      type: 'image/jpeg',
      name: 'mascota.jpg',
    });

    try {
      const response = await fetch('http://172.20.10.2/mascotas-api/endpoints/mascotas/registrar_mascotas.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('¡Éxito!', 'Mascota registrada correctamente. Podrás publicarla desde "Mascotas Registradas".', [
          { 
            text: 'OK', 
            onPress: () => {
              // Limpiar formulario
              setNombre('');
              setRaza('');
              setEdad('');
              setDescripcion('');
              setImagen(null);
              setTipo('Perro');
              setGenero('Macho');
              setTamano('Chico');
              setCastrado('No');
              setVacunado('No');
              
              if (navigation) navigation.goBack();
            }
          }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Error al registrar la mascota');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo conectar al servidor. Verifica tu conexión.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Registrar Nueva Mascota</Text>

        {/* Campo Nombre */}
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre de la mascota"
          placeholderTextColor="#999"
        />

        {/* Tipo de animal */}
        <DropMenu 
          label="Tipo de Animal" 
          value={tipo} 
          options={["Perro", "Gato", "Otro"]} 
          onSelect={setTipo} 
        />

        <DropMenu 
          label="Género" 
          value={genero} 
          options={["Macho", "Hembra"]} 
          onSelect={setGenero} 
        />

        {/* Campo Raza */}
        <Text style={styles.label}>Raza *</Text>
        <TextInput
          style={styles.input}
          value={raza}
          onChangeText={setRaza}
          placeholder="Ej: Labrador, Mestizo, etc."
          placeholderTextColor="#999"
        />

        <DropMenu 
          label="Tamaño" 
          value={tamano} 
          options={["Chico", "Mediano", "Grande"]} 
          onSelect={setTamano} 
        />

        {/* Campo Edad */}
        <Text style={styles.label}>Edad *</Text>
        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          placeholder="Ej: 2 años, 6 meses, etc."
          placeholderTextColor="#999"
        />

        <DropMenu 
          label="¿Está Castrado?" 
          value={castrado} 
          options={["Sí", "No"]} 
          onSelect={setCastrado} 
        />

        <DropMenu 
          label="¿Está Vacunado?" 
          value={vacunado} 
          options={["Sí", "No"]} 
          onSelect={setVacunado} 
        />

        
        <DropMenu 
          label="Estado" 
          value={estado} 
          options={["Adopción", "Tránsito", "Perdido"]} 
          onSelect={setEstado} 
        />


        {/* Selección de imagen */}
        <TouchableOpacity style={styles.btnSeleccionar} onPress={seleccionarImagen}>
          <Text style={styles.btnText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {imagen && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imagen.uri }} style={styles.preview} />
            <Text style={styles.previewText}>Imagen seleccionada</Text>
          </View>
        )}

        {/* Botón de registro */}
        <TouchableOpacity 
          style={[styles.btnGuardar, enviando && styles.btnDisabled]} 
          onPress={registrarMascota}
          disabled={enviando}
        >
          <Text style={styles.btnText}>
            {enviando ? 'Guardando...' : 'Registrar Mascota'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#f8f9fa',
    minHeight: '100%'
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 25
  },
  label: { 
    marginTop: 15, 
    marginBottom: 5,
    fontWeight: '600',
    fontSize: 16,
    color: '#34495e'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2c3e50'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  dropdownWrapper: { 
    marginBottom: 15 
  },
  dropdown: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2c3e50'
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2c3e50'
  },
  btnSeleccionar: {
    marginTop: 20,
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnGuardar: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#f39c12',
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnDisabled: { 
    backgroundColor: '#95a5a6',
    elevation: 0
  },
  btnText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16
  },
  previewContainer: {
    alignItems: 'center',
    marginTop: 15
  },
  preview: { 
    width: 200, 
    height: 200, 
    borderRadius: 10,
    marginBottom: 8
  },
  previewText: {
    color: '#27ae60',
    fontWeight: '600'
  },
  note: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20
  }
});

export default RegistrarMascota;