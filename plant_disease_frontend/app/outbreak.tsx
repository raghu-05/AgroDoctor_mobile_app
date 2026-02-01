import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import api from "./services/api";

type Hotspot = {
  latitude: number;
  longitude: number;
  disease_name: string;
  severity: number;
};

export default function OutbreakMapScreen() {
  const router = useRouter();
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      try {
        const response = await api.get("/get-hotspots/");
        setHotspots(response.data);
      } catch (error) {
        console.log("❌ Failed to load hotspots", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotspots();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🗺️ Disease Outbreak Map</Text>
        <Text style={styles.subtitle}>
          View reported disease hotspots across regions
        </Text>
      </View>

      {/* MAP / LOADER */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2e7d32"
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.mapCard}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: hotspots.length ? hotspots[0].latitude : 17.385,
              longitude: hotspots.length ? hotspots[0].longitude : 78.4867,
              latitudeDelta: 5,
              longitudeDelta: 5,
            }}
          >
            {hotspots.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.disease_name}
                description={`Severity: ${item.severity}`}
              />
            ))}
          </MapView>
        </View>
      )}

      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f4",
    padding: 16,
  },

  header: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#4e6e4e",
    textAlign: "center",
    marginTop: 4,
  },

  mapCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginVertical: 10,
  },

  map: {
    width: "100%",
    height: "100%",
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
    fontWeight: "bold",
    fontSize: 15,
  },
});
