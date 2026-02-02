import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
  StatusBar
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "./services/api";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function UploadScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  
  const [image, setImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // 📷 CAMERA
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera access is needed to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setShowPicker(false);
  };

  // 🖼️ GALLERY
  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Gallery access is needed to pick photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    setShowPicker(false);
  };

  // 🔍 ANALYZE
  const analyzePlant = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture a leaf image first.");
      return;
    }

    setLoading(true);

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
      Alert.alert("Analysis Failed", "Could not process the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: '#fff', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 }]}>
            <Image 
              source={require('../assets/images/icon.jpg')} 
              style={{ width: 60, height: 60, borderRadius: 12 }} 
              resizeMode="contain"
            />
          </View>
        <Text style={[styles.title, { color: colors.text }]}>Plant Diagnosis</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Upload a clear image of the affected leaf
        </Text>
      </View>

      {/* Image Preview Area */}
      <View style={styles.content}>
        {image ? (
          <View style={[styles.imageCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity 
              style={[styles.removeBtn, { backgroundColor: colors.card }]} 
              onPress={() => setImage(null)}
            >
              <Ionicons name="close" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.placeholderBox, { borderColor: colors.border, backgroundColor: colors.card }]} 
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="cloud-upload-outline" size={48} color={colors.primary} />
            <Text style={[styles.placeholderText, { color: colors.icon }]}>Tap to Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {image ? (
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
            onPress={analyzePlant}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="search" size={24} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.analyzeButtonText}>Analyze Plant</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={() => setShowPicker(true)}>
            <MaterialIcons name="add-a-photo" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Select Image</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: isDark ? '#fff' : '#333' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ STYLED IMAGE SOURCE MODAL */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Image Source</Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}
              onPress={openCamera}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}
              onPress={openGallery}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalCancel, { backgroundColor: isDark ? '#444' : '#EEE' }]}
              onPress={() => setShowPicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholderBox: {
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  imageCard: {
    borderRadius: 20,
    padding: 10,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: 'relative',
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 15,
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    padding: 8,
    borderRadius: 20,
    elevation: 4,
  },
  footer: {
    marginBottom: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  analyzeButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  modalCancel: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});