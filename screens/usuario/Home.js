
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkSession = async () => {
      const session = await AsyncStorage.getItem("userData");
      if (!session) {
        navigation.navigate("Login");
      }
    };
    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffefe4" }}>
      <ScrollView>
        <Header />
        <Image source={require("../../assets/portada.jpg")} style={styles.banner} />
        <View style={styles.overlay}>
          <Text style={styles.title}>Bienvenidos a Adoptame Saladillo</Text>
          <Text style={styles.subtitle}>
            ¡Encontrá a tu compañero perfecto, o ayudá a una mascota a encontrar su hogar!
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🐾 Mascotas en Adopción</Text>
            <Text style={styles.cardText}>Dale un hogar lleno de amor a una mascota</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Adopcion")}>
              <Text style={styles.buttonText}>Ver mascotas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏠 Mascotas en Tránsito</Text>
            <Text style={styles.cardText}>
              Ayudá temporalmente a una mascota mientras encuentra hogar definitivo
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Transito")}>
              <Text style={styles.buttonText}>Ver mascotas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔍 Mascotas Perdidas</Text>
            <Text style={styles.cardText}>
              Ayudanos a reunir mascotas perdidas con sus familias
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Perdidas")}>
              <Text style={styles.buttonText}>Ver mascotas</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📢 Reportar Mascota</Text>
            <Text style={styles.cardText}>
              ¿Encontraste o perdiste una mascota? Reportala acá
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("ChatUsuario")}>
            <Text style={styles.buttonText}>Reportar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>❤️ Realizar Donación</Text>
            <Text style={styles.cardText}>
              Tu ayuda es fundamental para continuar con nuestra labor
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Donaciones")}>
              <Text style={styles.buttonText}>Donar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  overlay: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  cardContainer: {
    padding: 20,
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#eb5d37",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
