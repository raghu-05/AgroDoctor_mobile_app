import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import api from "./services/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function FeedbackScreen() {
  const router = useRouter();
  const [feedback, setFeedback] = useState("");

  const submitFeedback = async () => {
    if (!feedback.trim()) {
      Alert.alert("Error", "Please enter your feedback");
      return;
    }

    try {
      // Get logged-in user details
      const userResponse = await api.get("/users/me/");
      const user = userResponse.data;

      await api.post("/submit-feedback/", {
        name: user.name,
        email: user.email,
        message: feedback,
      });

      Alert.alert("Thank you!", "Your feedback has been submitted.");
      setFeedback("");
      router.back();
    } catch (error) {
      console.log("Feedback error:", error);
      Alert.alert("Error", "Failed to submit feedback");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📝 Feedback</Text>
        <Text style={styles.subtitle}>
          Help us improve AgroDoctor by sharing your thoughts
        </Text>

        {/* FEEDBACK CARD */}
        <View style={styles.card}>
          <TextInput
            placeholder="Write your feedback here..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            style={styles.input}
            placeholderTextColor="#9e9e9e"
          />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity style={styles.primaryButton} onPress={submitFeedback}>
          <MaterialIcons name="send" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f4",
  },

  /** Same centering fix as other pages */
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#4e6e4e",
    textAlign: "center",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  input: {
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: 15,
    color: "#212121",
  },

  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  backButton: {
    flexDirection: "row",
    backgroundColor: "#9e9e9e",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
