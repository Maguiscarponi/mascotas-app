import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardAdmin = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.menuItemText}>WEB</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('MascotasRegistradas')}>
          <Text style={styles.menuItemText}>Mascotas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('RegistrarMascota')}>
          <Text style={styles.menuItemText}>Registrar Mascota</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Solicitudes')}>
          <Text style={styles.menuItemText}>Solicitudes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('ChatsActivos')}>
          <Text style={styles.menuItemText}>Chats Activos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.menuItemText}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',      
    justifyContent: 'center',       
    alignItems: 'center',           
  },
  menuContainer: {
    width: '100%',                 
    alignItems: 'center',           
  },
  menuItem: {
    backgroundColor: '#ee6c4d',     
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',                
    alignItems: 'center',         
    elevation: 3,                 
    shadowColor: '#000',         
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  menuItemText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DashboardAdmin;
