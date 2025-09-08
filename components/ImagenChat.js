import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';

const ImagenChat = ({ onImagenSeleccionada }) => {
  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Sin edición/recorte
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        // Redimensionar si es muy grande
        const asset = result.assets[0];
        let finalUri = asset.uri;
        
        if (asset.width > 1200 || asset.height > 1200) {
          const manipResult = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1200 } }], // Máximo 1200px ancho
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          finalUri = manipResult.uri;
        }
        
        onImagenSeleccionada(finalUri);
      } catch (error) {
        console.error('Error procesando imagen:', error);
        Alert.alert('Error', 'La imagen es demasiado grande');
      }
    }
  };

  return (
    <TouchableOpacity onPress={seleccionarImagen}>
      <Ionicons name="image-outline" size={24} color="#0084FF" />
    </TouchableOpacity>
  );
};

export default ImagenChat;

