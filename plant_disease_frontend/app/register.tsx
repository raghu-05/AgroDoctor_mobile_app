import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import api from "./services/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const registerUser = async () => {
    if (!name || !email || !username || !password) {
      Alert.alert("Missing Fields", "Please fill in all the details to continue.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/", {
        name,
        email,
        username,
        password,
      });

      Alert.alert(
        "Registration Successful",
        "Your account has been created. Please login to continue."
      );

      router.replace("/login");
    } catch (error: any) {
      console.log("Register error:", error);
      Alert.alert(
        "Registration Failed",
        error?.response?.data?.detail || "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="person-add" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Join AgroDoctor for smarter farming
          </Text>
        </View>

        {/* Form Card */}
        <View style={[
          styles.card, 
          { 
            backgroundColor: colors.card, 
            borderColor: isDark ? colors.border : 'transparent',
            borderWidth: isDark ? 1 : 0
          }
        ]}>
          
          {/* Full Name Input */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="person-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={colors.icon}
              value={name}
              onChangeText={setName}
              style={[styles.input, { color: colors.text }]}
            />
          </View>

          {/* Email Input */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="mail-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={colors.icon}
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Username Input */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="at-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor={colors.icon}
              value={username}
              onChangeText={setUsername}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.icon}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.text }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.icon} 
              />
            </TouchableOpacity>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.registerBtn, { backgroundColor: colors.primary }]} 
            onPress={registerUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.icon }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  registerBtn: {
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "bold",
  },
});