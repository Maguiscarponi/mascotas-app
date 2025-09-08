import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';

export default function Registro({ navigation }) {
  // Estados de formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  // Estados de validación de contraseña
  const [longitudValida, setLongitudValida] = useState(false);
  const [tieneMayuscula, setTieneMayuscula] = useState(false);
  const [tieneMinuscula, setTieneMinuscula] = useState(false);
  const [tieneNumero, setTieneNumero] = useState(false);
  const [tieneEspecial, setTieneEspecial] = useState(false);
  const [contrasenasCoinciden, setContrasenasCoinciden] = useState(false);

  // Recalcular validaciones cada vez que cambia contraseña o confirmación
  useEffect(() => {
    setLongitudValida(contrasena.length >= 8);
    setTieneMayuscula(/[A-Z]/.test(contrasena));
    setTieneMinuscula(/[a-z]/.test(contrasena));
    setTieneNumero(/[0-9]/.test(contrasena));
    setTieneEspecial(/[^A-Za-z0-9]/.test(contrasena));
    setContrasenasCoinciden(contrasena !== '' && contrasena === confirmarContrasena);
  }, [contrasena, confirmarContrasena]);

  // Todas las condiciones deben cumplirse
  const todoValido = longitudValida && tieneMayuscula && tieneMinuscula && tieneNumero && tieneEspecial && contrasenasCoinciden;

  const manejarRegistro = () => {
    if (!nombreCompleto || !correo || !contrasena || !confirmarContrasena) {
      Alert.alert('Error', 'Por favor completá todos los campos.');
      return;
    }
    if (!todoValido) {
      Alert.alert('Error', 'Revisá las condiciones de la contraseña y que coincidan las contraseñas.');
      return;
    }

    fetch('http://172.20.10.2/mascotas-api/endpoints/auth/registro.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombreCompleto,
        email: correo,
        password: contrasena
      })
    })
      .then(respuesta => respuesta.json())
      .then(json => {
        if (json.success) {
          Alert.alert('¡Éxito!', json.message);
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', json.message || 'No se pudo registrar.');
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'No se pudo conectar con el servidor');
      });
  };

  // Componente para mostrar cada condición
  const Condicion = ({ cumplida, texto }) => (
    <View style={styles.filaCondicion}>
      <Text style={[styles.iconoCondicion, cumplida ? styles.ok : styles.no]}>✕</Text>
      <Text style={styles.textoCondicion}>{texto}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.titulo}>Registro de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <View style={styles.contenedorCondiciones}>
        <Condicion cumplida={longitudValida} texto="Mínimo 8 caracteres" />
        <Condicion cumplida={tieneMayuscula} texto="Una letra mayúscula" />
        <Condicion cumplida={tieneMinuscula} texto="Una letra minúscula" />
        <Condicion cumplida={tieneNumero} texto="Un número" />
        <Condicion cumplida={tieneEspecial} texto="Un carácter especial" />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        secureTextEntry
      />

      {!contrasenasCoinciden && confirmarContrasena.length > 0 && (
        <Text style={styles.warning}>Las contraseñas no coinciden</Text>
      )}

      <TouchableOpacity
        style={[styles.boton, !todoValido && styles.botonDeshabilitado]}
        onPress={manejarRegistro}
        disabled={!todoValido}
      >
        <Text style={styles.textoBoton}>Registrarse</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.textoFooter}>¿Ya estás registrado? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkFooter}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'stretch'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#264653'
  },
  input: {
    borderWidth: 2,
    borderColor: '#E57C00',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
  contenedorCondiciones: {
    marginBottom: 16
  },
  filaCondicion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  iconoCondicion: {
    width: 20,
    textAlign: 'center',
    fontSize: 16
  },
  ok: {
    color: 'green'
  },
  no: {
    color: 'red'
  },
  textoCondicion: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333'
  },
  warning: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center'
  },
  boton: {
    backgroundColor: '#ee6c4d',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8
  },
  botonDeshabilitado: {
    backgroundColor: '#ccc'
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
  },
  textoFooter: {
    fontSize: 16,
    color: '#666'
  },
  linkFooter: {
    fontSize: 16,
    color: '#ee6c4d',
    fontWeight: '600'
  }
});


