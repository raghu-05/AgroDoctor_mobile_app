import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
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

export default function FeedbackScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Empty Feedback", "Please write something before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Get logged-in user details
      const userResponse = await api.get("/users/me/");
      const user = userResponse.data;

      await api.post("/submit-feedback/", {
        name: user.name,
        email: user.email,
        message: feedback,
      });

      Alert.alert(
        "Thank You!",
        "Your feedback helps us improve AgroDoctor."
      );
      
      setFeedback("");
      router.back();
    } catch (error) {
      console.log("Feedback error:", error);
      Alert.alert("Submission Failed", "Could not send feedback. Please try again later.");
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
            <Ionicons name="chatbox-ellipses" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>We Value Your Feedback</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Share your experience to help us grow
          </Text>
        </View>

        {/* Input Card */}
        <View style={[
          styles.card, 
          { 
            backgroundColor: colors.card, 
            borderColor: isDark ? colors.border : 'transparent',
            borderWidth: isDark ? 1 : 0
          }
        ]}>
          <TextInput
            placeholder="Write your suggestions, bugs, or comments here..."
            placeholderTextColor={colors.icon}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            style={[styles.input, { color: colors.text, backgroundColor: isDark ? '#2C2C2C' : '#F9F9F9' }]}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.submitBtn, { backgroundColor: colors.primary }]} 
            onPress={submitFeedback}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.btnText}>Submit Feedback</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.cancelBtn, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} 
            onPress={() => router.back()}
          >
            <Text style={[styles.btnText, { color: isDark ? '#FFF' : '#333' }]}>Cancel</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 16,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 25,
  },
  input: {
    minHeight: 180,
    textAlignVertical: "top",
    fontSize: 16,
    padding: 15,
    borderRadius: 12,
  },
  buttonContainer: {
    gap: 15,
  },
  submitBtn: {
    flexDirection: "row",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cancelBtn: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});