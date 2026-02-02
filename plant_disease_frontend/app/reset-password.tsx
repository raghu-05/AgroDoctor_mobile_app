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
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "./services/api";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ResetPasswordOTPScreen() {
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/reset-password-otp", null, {
        params: {
          email,
          otp,
          new_password: password,
        },
      });

      Alert.alert(
        "Password Reset Successful",
        "You can now login with your new password.",
        [{ text: "Login Now", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      console.log("Reset error:", error);
      Alert.alert(
        "Reset Failed",
        error?.response?.data?.detail || "Invalid OTP or Server Error"
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
        
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="key" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Create a new password for your account
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

          {/* OTP Input */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Enter 4-digit OTP"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
          </View>

          {/* New Password */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              secureTextEntry={!showPass}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={colors.icon}
              style={[styles.input, { color: colors.text }]}
              secureTextEntry={!showPass}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons 
                name={showPass ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color={colors.icon} 
              />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: colors.primary }]}
            onPress={resetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetBtnText}>Update Password</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => router.replace("/login")}
          >
            <Text style={[styles.cancelText, { color: colors.icon }]}>Cancel</Text>
          </TouchableOpacity>

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
  resetBtn: {
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
    marginBottom: 15,
  },
  resetBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});