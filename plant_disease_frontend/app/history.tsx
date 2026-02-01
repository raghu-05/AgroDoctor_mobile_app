import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "./services/api";
import { MaterialIcons } from "@expo/vector-icons";

type HistoryItem = {
  id: number;
  disease_name: string;
  severity: number;
  created_at?: string;
  timestamp?: string;
};

const formatDate = (item: any) => {
  if (!item.timestamp && !item.created_at) return "Date not available";

  const date = new Date(item.timestamp || item.created_at);
  return isNaN(date.getTime())
    ? "Date not available"
    : date.toLocaleString();
};

export default function HistoryScreen() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history/me/");
        setHistory(response.data);
      } catch (error) {
        console.log("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🕘 Diagnosis History</Text>
        <Text style={styles.subtitle}>
          Your previously analyzed plant diseases
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2e7d32"
            style={{ marginTop: 30 }}
          />
        ) : history.length === 0 ? (
          <Text style={styles.empty}>No diagnosis history found.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <MaterialIcons
                    name="local-florist"
                    size={20}
                    color="#2e7d32"
                  />
                  <Text style={styles.disease}>{item.disease_name}</Text>
                </View>

                <Text style={styles.severity}>
                  Severity:{" "}
                  <Text style={styles.severityValue}>{item.severity}</Text>
                </Text>

                <Text style={styles.date}>{formatDate(item)}</Text>
              </View>
            )}
          />
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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

  /** Same centering fix as other screens */
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
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  disease: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b5e20",
    marginLeft: 6,
  },

  severity: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  severityValue: {
    fontWeight: "bold",
    color: "#2e7d32",
  },

  date: {
    fontSize: 12,
    color: "#757575",
    marginTop: 6,
  },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#757575",
    fontSize: 15,
  },

  backButton: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
