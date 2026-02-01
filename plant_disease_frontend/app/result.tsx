import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import api from "./services/api";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const disease = params.disease as string;
  const confidence = params.confidence as string;
  const severity = params.severity as string;

  const saveDiagnosis = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required to save diagnosis."
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (!loc || !loc.coords) {
        Alert.alert(
          "Location unavailable",
          "Please enable GPS/location services on your device."
        );
        return;
      }

      await api.post("/log-diagnosis/", {
        disease_name: disease,
        severity: parseFloat(severity),
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Success", "Diagnosis saved successfully.");
    } catch (error) {
      console.log("Save diagnosis error:", error);
      Alert.alert(
        "Error",
        "Unable to get location. Please enable GPS and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Analysis Result</Text>
        <Text style={styles.subtitle}>
          AI-based plant disease detection
        </Text>
      </View>

      {/* RESULT CARD */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Disease</Text>
          <Text style={styles.value}>{disease}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Confidence</Text>
          <Text style={styles.value}>{confidence}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Severity</Text>
          <Text style={styles.value}>{severity}</Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/treatment",
            params: { disease, severity },
          })
        }
      >
        <Text style={styles.primaryButtonText}>View Treatment Plan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          router.push({
            pathname: "/impact",
            params: { disease, severity },
          })
        }
      >
        <Text style={styles.primaryButtonText}>View Economic Impact</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={saveDiagnosis}
      >
        <Text style={styles.secondaryButtonText}>Save Diagnosis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => router.back()}
      >
        <Text style={styles.outlineButtonText}>
          Analyze Another Image
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f4",
    padding: 20,
    justifyContent: "center",
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
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  row: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: "#757575",
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginTop: 2,
  },

  primaryButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  secondaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  outlineButton: {
    borderWidth: 1.5,
    borderColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
  },

  outlineButtonText: {
    color: "#2e7d32",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
