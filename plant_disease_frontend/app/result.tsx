import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Location from "expo-location";
import api from "./services/api";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ResultScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const params = useLocalSearchParams();

  // Parse params
  const disease = params.disease as string;
  const confidence = params.confidence as string; // e.g. "98.5%"
  const severity = parseFloat(params.severity as string); // e.g. 45.2
  const imageUri = params.imageUri as string;

  const [saving, setSaving] = useState(false);

  // Helper for Severity Color
  const getSeverityColor = (val: number) => {
    if (val < 30) return colors.primary; // Low - Green
    if (val < 60) return "#F57C00";      // Medium - Orange
    return colors.danger;                // High - Red
  };

  const saveDiagnosis = async () => {
    setSaving(true);
    try {
      // 1. Get Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required to save diagnosis.");
        setSaving(false);
        return;
      }

      // 2. Get Location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (!loc || !loc.coords) {
        Alert.alert("Location Error", "Please enable GPS to tag this diagnosis.");
        setSaving(false);
        return;
      }

      // 3. Save to API
      await api.post("/log-diagnosis/", {
        disease_name: disease,
        severity: severity,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Saved", "Diagnosis logged to your history successfully.");
      // Optional: Navigate to history or stay
    } catch (error) {
      console.log("Save diagnosis error:", error);
      Alert.alert("Save Failed", "Could not save to database. Check connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Analysis Result</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Image Preview Card */}
        <View style={[styles.imageCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.plantImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="image-off" size={40} color={colors.icon} />
            </View>
          )}
          
          <View style={styles.overlayTag}>
            <Text style={styles.confidenceText}>Confidence: {confidence}</Text>
          </View>
        </View>

        {/* Diagnosis Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.label, { color: colors.icon }]}>Detected Disease</Text>
          <Text style={[styles.diseaseName, { color: colors.text }]}>{disease}</Text>
        </View>

        {/* Severity Meter */}
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.metricRow}>
            <Text style={[styles.metricLabel, { color: colors.text }]}>Severity Level</Text>
            <Text style={[styles.metricValue, { color: getSeverityColor(severity) }]}>
              {severity.toFixed(1)}%
            </Text>
          </View>
          {/* Progress Bar Background */}
          <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
            {/* Actual Progress */}
            <View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${Math.min(severity, 100)}%`, 
                  backgroundColor: getSeverityColor(severity) 
                }
              ]} 
            />
          </View>
        </View>

        {/* Actions Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended Actions</Text>
        
        <View style={styles.actionGrid}>
          {/* 1. Treatment */}
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}
            onPress={() => router.push({ pathname: "/treatment", params: { disease, severity } })}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="medical-services" size={24} color="#fff" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Treatment Plan</Text>
          </TouchableOpacity>

          {/* 2. Economic Impact */}
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#FFF3E0' }]}
            onPress={() => router.push({ pathname: "/impact", params: { disease, severity } })}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F57C00' }]}>
              <MaterialIcons name="trending-down" size={24} color="#fff" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Economic Loss</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.card, borderColor: colors.primary }]} 
          onPress={saveDiagnosis}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={[styles.saveText, { color: colors.primary }]}>Save to History</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Disclaimer */}
        <Text style={[styles.disclaimer, { color: colors.icon }]}>
          AI predictions may vary. Consult an expert for critical decisions.
        </Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageCard: {
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  plantImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTag: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  diseaseName: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  metricCard: {
    padding: 15,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: 25,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});