import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "./services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    try {
      const response = await api.post(
        "/token",
        new URLSearchParams({
          username: username,
          password: password,
        }).toString()
      );

      await AsyncStorage.setItem(
        "access_token",
        response.data.access_token
      );

      Alert.alert("Success", "Login successful");
      router.replace("/");

    } catch (error: any) {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🌱 AgroDoctor</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        {/* Username */}
        <View style={styles.inputBox}>
          <MaterialIcons name="person" size={20} color="#4e6e4e" />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholderTextColor="#7a9b7a"
          />
        </View>

        {/* Password */}
        <View style={styles.inputBox}>
          <MaterialIcons name="lock" size={20} color="#4e6e4e" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#7a9b7a"
          />
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>
            New user? <Text style={{ fontWeight: "bold" }}>Register here</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f4",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#4e6e4e",
    textAlign: "center",
    marginBottom: 24,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8e9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1b5e20",
  },

  button: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  link: {
    color: "#2e7d32",
    textAlign: "center",
    marginTop: 12,
    fontSize: 14,
  },
});
