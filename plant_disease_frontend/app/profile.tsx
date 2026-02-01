import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import api from "./services/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me/");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>👤 My Profile</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2e7d32" />
        ) : user ? (
          <View style={styles.card}>
            <View style={styles.row}>
              <MaterialIcons name="person" size={20} color="#2e7d32" />
              <Text style={styles.value}>{user.name}</Text>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="email" size={20} color="#2e7d32" />
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.row}>
              <MaterialIcons name="account-circle" size={20} color="#2e7d32" />
              <Text style={styles.value}>{user.username}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>Failed to load profile</Text>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backText}>Go Back</Text>
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
  },

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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  value: {
    fontSize: 16,
    marginLeft: 10,
    color: "#212121",
    fontWeight: "600",
  },

  errorText: {
    textAlign: "center",
    color: "red",
    marginVertical: 20,
  },

  backButton: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
