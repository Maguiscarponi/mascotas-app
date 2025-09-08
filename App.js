import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/usuario/Home';
import MascotasAdopcion from './screens/usuario/MascotasAdopcion';
import MascotasTransito from './screens/usuario/MascotasTransito';
import MascotasPerdidas from './screens/usuario/MascotasPerdidas';
import FormularioAdopcion from './screens/usuario/FormularioAdopcion';
import FormularioTransito from './screens/usuario/FormularioTransito';
import FormularioConsulta from './screens/usuario/FormularioConsulta';
import DetalleMascota from './screens/usuario/DetalleMascota';
import Login from './screens/usuario/Login';
import DashboardAdmin from './screens/admin/DashboardAdmin';
import Header from './components/Header';
import MascotasRegistradas from './screens/admin/MascotasRegistradas';
import Solicitudes from './screens/admin/Solicitudes';
import RegistrarMascota from './screens/admin/RegistrarMascota';
import EditarMascota from './screens/admin/EditarMascota';
import ChatUsuario from './screens/usuario/chat/ChatUsuario';
import ChatAdmin from './screens/admin/chat/ChatAdmin';
import ChatsActivos from './screens/admin/chat/ChatsActivos';
import Registro from './screens/usuario/Registro';
import Donaciones from './screens/usuario/Donaciones';
import ModalPublicar from './components/ModalPublicar';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: "Inicio" }} />
        <Stack.Screen name="Adopcion" component={MascotasAdopcion} options={{ title: "Mascotas en Adopción" }} />
        <Stack.Screen name="Transito" component={MascotasTransito} options={{ title: "Mascotas en Tránsito" }} />
        <Stack.Screen name="Perdidas" component={MascotasPerdidas} options={{ title: "Mascotas Perdidas" }} />
        <Stack.Screen name="FormularioAdopcion" component={FormularioAdopcion} />
        <Stack.Screen name="FormularioTransito" component={FormularioTransito} />
        <Stack.Screen name="FormularioConsulta" component={FormularioConsulta} />
        <Stack.Screen name="DetalleMascota" component={DetalleMascota} options={{ title: "Detalles de la Mascota" }} />
        <Stack.Screen name="Login" component={Login} options={{ title: "Iniciar Sesión" }} />
        <Stack.Screen name="DashboardAdmin" component={DashboardAdmin} options={{ title: "Panel de Administración" }} />
        <Stack.Screen name="Header" component={Header} options={{ title: "Header" }} />
        <Stack.Screen name="MascotasRegistradas" component={MascotasRegistradas} options={{ title: "Mascotas Registradas" }} />
        <Stack.Screen name="Solicitudes" component={Solicitudes} options={{ title: "Solicitudes" }} />
        <Stack.Screen name="RegistrarMascota" component={RegistrarMascota} options={{ title: "Registrar Mascota" }} />
        <Stack.Screen name="EditarMascota" component={EditarMascota} options={{ title: "Editar Mascota" }} />
        <Stack.Screen name="ChatUsuario" component={ChatUsuario} options={{ title: "Chat Usuario" }} />
        <Stack.Screen name="ChatAdmin" component={ChatAdmin} options={{ title: "Chat Admin" }} />
        <Stack.Screen name="ChatsActivos" component={ChatsActivos} options={{ title: "Chats Activos" }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: "Registro" }} />
        <Stack.Screen name="Donaciones" component={Donaciones} options={{ title: "Donaciones" }} />
        <Stack.Screen name="ModalPublicar" component={ModalPublicar} options={{ title: "Publicar Mascota", presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}