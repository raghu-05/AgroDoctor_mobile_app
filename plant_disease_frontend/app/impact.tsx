import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "./services/api";
import { MaterialIcons } from "@expo/vector-icons";

export default function ImpactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const disease = params.disease as string;
  const severity = parseFloat(params.severity as string);

  const [impact, setImpact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const response = await api.get("/calculate-impact/", {
          params: {
            disease_name: disease,
            severity: severity,
          },
        });

        setImpact(response.data);
      } catch (error) {
        setImpact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📉 Economic Impact</Text>
        <Text style={styles.subtitle}>
          Estimated crop and financial loss
        </Text>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={styles.loadingText}>Calculating impact...</Text>
          </View>
        ) : impact ? (
          <View style={styles.card}>
            {/* Crop */}
            <View style={styles.row}>
              <MaterialIcons name="grass" size={22} color="#2e7d32" />
              <View style={styles.textBlock}>
                <Text style={styles.label}>Crop</Text>
                <Text style={styles.value}>{impact.crop_name}</Text>
              </View>
            </View>

            {/* Yield Loss */}
            <View style={styles.row}>
              <MaterialIcons name="trending-down" size={22} color="#d32f2f" />
              <View style={styles.textBlock}>
                <Text style={styles.label}>Yield Loss</Text>
                <Text style={styles.value}>
                  {impact.yield_loss_percentage}%
                </Text>
              </View>
            </View>

            {/* Financial Loss */}
            <View style={styles.row}>
              <MaterialIcons name="currency-rupee" size={22} color="#f57c00" />
              <View style={styles.textBlock}>
                <Text style={styles.label}>Estimated Financial Loss</Text>
                <Text style={styles.value}>
                  ₹ {impact.potential_financial_loss_min} – ₹{" "}
                  {impact.potential_financial_loss_max}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={28} color="#d32f2f" />
            <Text style={styles.errorText}>
              Unable to calculate economic impact.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.buttonText}>Go Back</Text>
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

  /** 👇 THIS FIXES THE STATUS BAR ISSUE */
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
    marginBottom: 24,
  },

  loaderBox: {
    alignItems: "center",
    marginVertical: 30,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4e6e4e",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  textBlock: {
    marginLeft: 12,
    flex: 1,
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

  errorBox: {
    alignItems: "center",
    marginVertical: 30,
  },

  errorText: {
    marginTop: 8,
    fontSize: 15,
    color: "#d32f2f",
    textAlign: "center",
  },

  button: {
    flexDirection: "row",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
