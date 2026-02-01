import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import api from "./services/api";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  // 📷 CAMERA
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera permission is needed");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🖼️ GALLERY
  const openGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Gallery access is needed");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🔍 ANALYZE
  const analyzePlant = async () => {
    if (!image) {
      Alert.alert("Error", "Select or capture an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "leaf.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await api.post("/analyze-plant/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;

      router.push({
        pathname: "/result",
        params: {
          disease: data.disease_name,
          confidence: data.confidence,
          severity: data.severity_percentage,
          imageUri: image,
        },
      });
    } catch (error) {
      console.log("Analyze error:", error);
      Alert.alert("Error", "Failed to analyze image");
    }
  };

  // 📌 OPEN STYLED PICKER
  const chooseImageSource = () => {
    setShowPicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Plant Disease Analysis</Text>
      <Text style={styles.subtitle}>
        Upload or capture a leaf image to detect disease
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={chooseImageSource}>
        <Text style={styles.primaryButtonText}>Pick Leaf Image</Text>
      </TouchableOpacity>

      {image && (
        <View style={styles.imageCard}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          !image && styles.disabledButton,
        ]}
        onPress={analyzePlant}
        disabled={!image}
      >
        <Text style={styles.analyzeButtonText}>Analyze</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      {/* ✅ STYLED IMAGE SOURCE MODAL */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Image Source</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowPicker(false);
                openCamera();
              }}
            >
              <MaterialIcons name="photo-camera" size={24} color="#2e7d32" />
              <Text style={styles.modalButtonText}>Camera</Text>
            </Pressable>

            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowPicker(false);
                openGallery();
              }}
            >
              <MaterialIcons name="photo-library" size={24} color="#2e7d32" />
              <Text style={styles.modalButtonText}>Gallery</Text>
            </Pressable>

            <Pressable
              style={styles.modalCancel}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f9f4",
    padding: 20,
    justifyContent: "center",
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

  primaryButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },

  primaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginVertical: 16,
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },

  analyzeButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
  },

  analyzeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    backgroundColor: "#a5d6a7",
  },

  /* ===== MODAL STYLES ===== */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#1b5e20",
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f1f8e9",
  },

  modalButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },

  modalCancel: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#eeeeee",
  },

  modalCancelText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
  },
  backButton: {
  flexDirection: "row",
  backgroundColor: "#9e9e9e",
  paddingVertical: 14,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 12,
},

backButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
},

});
