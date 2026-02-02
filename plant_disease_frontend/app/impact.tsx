import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "./services/api";
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ImpactScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors, isDark } = useTheme();

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
  }, [disease, severity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary + '20' }]}>
            <MaterialIcons name="trending-down" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Economic Impact</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Estimated yield and financial loss analysis
          </Text>
        </View>

        {loading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.icon }]}>Calculating potential loss...</Text>
          </View>
        ) : impact ? (
          <View style={[
            styles.card, 
            { 
              backgroundColor: colors.card, 
              borderColor: isDark ? colors.border : 'transparent',
              borderWidth: isDark ? 1 : 0
            }
          ]}>
            
            {/* Crop Info */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                <MaterialCommunityIcons name="sprout" size={24} color={colors.primary} />
              </View>
              <View style={styles.textBlock}>
                <Text style={[styles.label, { color: colors.icon }]}>Affected Crop</Text>
                <Text style={[styles.value, { color: colors.text }]}>{impact.crop_name}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Yield Loss */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                <MaterialIcons name="inventory" size={24} color={colors.danger} />
              </View>
              <View style={styles.textBlock}>
                <Text style={[styles.label, { color: colors.icon }]}>Estimated Yield Loss</Text>
                <Text style={[styles.value, { color: colors.danger }]}>
                  {impact.yield_loss_percentage}%
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Financial Loss */}
            <View style={styles.row}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="currency-inr" size={24} color="#F57C00" />
              </View>
              <View style={styles.textBlock}>
                <Text style={[styles.label, { color: colors.icon }]}>Potential Financial Loss</Text>
                <Text style={[styles.value, { color: "#F57C00" }]}>
                  ₹ {impact.potential_financial_loss_min} – ₹ {impact.potential_financial_loss_max}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={48} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.text }]}>
              Unable to calculate economic impact for this disease type.
            </Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Go Back</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  header: {
    alignItems: "center",
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  loaderBox: {
    alignItems: "center",
    marginVertical: 30,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 10,
    opacity: 0.5,
  },
  errorBox: {
    alignItems: "center",
    padding: 30,
  },
  errorText: {
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  backButton: {
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});