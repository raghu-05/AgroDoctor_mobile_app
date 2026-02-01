import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import api from "./services/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const registerUser = async () => {
    if (!name || !email || !username || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      await api.post("/users/", {
        name,
        email,
        username,
        password,
      });

      Alert.alert(
        "Success",
        "Account created successfully. Please login."
      );

      router.replace("/login");
    } catch (error: any) {
      console.log("Register error:", error);

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.detail || "Unable to register user"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Create Account</Text>
        <Text style={styles.subtitle}>
          Join AgroDoctor for smart plant care
        </Text>
      </View>

      {/* FORM CARD */}
      <View style={styles.card}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Email Address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={registerUser}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.link}>
            Already have an account? Login
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

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b5e20",
  },

  subtitle: {
    fontSize: 14,
    color: "#4e6e4e",
    marginTop: 4,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  input: {
    backgroundColor: "#f9fdf9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#c5e1a5",
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
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  link: {
    color: "#2e7d32",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});
