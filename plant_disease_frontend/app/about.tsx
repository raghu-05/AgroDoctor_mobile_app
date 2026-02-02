import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function AboutScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const techStack = [
    "EfficientNetV2",
    "OpenCV",
    "Google Gemini",
    "FastAPI",
    "PostgreSQL",
    "React Native"
  ];

  const developers = [
    "Arja Raghuveer",
    "Kunapareddi Naga Tanuja",
    "Lingam Siva Surya Pavan",
    "Chinthalagunta Prabhu Kiran"
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header with Back Button */}
      <View style={[styles.headerRow, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={[styles.logoCircle, { backgroundColor: '#fff', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1 }]}>
            <Image 
              source={require('../assets/images/icon.jpg')} 
              style={{ width: 60, height: 60, borderRadius: 12 }} 
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Empowering Farmers</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            An Integrated App For Plant Health Management Using Deep Learning and Generative AI
          </Text>
        </View>

        {/* VISION CARD */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="eye-outline" size={22} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Our Vision</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.text }]}>
            <Text style={{ fontWeight: 'bold', color: colors.primary }}>AgroDoctor AI</Text> is a comprehensive decision-support system answering critical questions:
            {"\n\n"}• How severe is the damage?
            {"\n"}• What is the potential economic loss?
            {"\n"}• What is the exact treatment plan?
          </Text>
        </View>

        {/* RESEARCH CARD */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="library-outline" size={22} color="#FF9800" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Research Foundation</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.text }]}>
            Based on research published in <Text style={{ fontWeight: "bold" }}>IEEE Access (2024)</Text>, utilizing high-accuracy Deep Learning for disease classification.
          </Text>

          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.primary }]}
            onPress={() => Linking.openURL("https://ieeexplore.ieee.org/document/10599267")}
          >
            <MaterialIcons name="open-in-new" size={18} color="#fff" />
            <Text style={styles.linkButtonText}>Read IEEE Paper</Text>
          </TouchableOpacity>
        </View>

        {/* INNOVATIONS */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="rocket-outline" size={22} color="#E91E63" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Key Innovations</Text>
          </View>
          
          <View style={styles.listItem}>
            <Text style={styles.bullet}>1.</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              <Text style={{ fontWeight: "bold" }}>Severity Scoring:</Text> HSV color segmentation for precise damage calculation.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>2.</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              <Text style={{ fontWeight: "bold" }}>GenAI Advisory:</Text> Google Gemini generates 7-day multilingual plans.
            </Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>3.</Text>
            <Text style={[styles.listText, { color: colors.text }]}>
              <Text style={{ fontWeight: "bold" }}>Economic Engine:</Text> Estimates financial loss based on severity.
            </Text>
          </View>
        </View>

        {/* TECHNOLOGIES */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="code-slash-outline" size={22} color="#2196F3" />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Tech Stack</Text>
          </View>
          <View style={styles.techRow}>
            {techStack.map((tech, index) => (
              <View key={index} style={[styles.techBox, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.techText, { color: colors.primary }]}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* DEVELOPERS */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: isDark ? 1 : 0 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="people-outline" size={22} color={colors.text} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Developed By</Text>
          </View>
          {developers.map((dev, index) => (
            <Text key={index} style={[styles.devName, { color: colors.icon }]}>
              • {dev}
            </Text>
          ))}
        </View>

        {/* GITHUB BUTTON */}
        <TouchableOpacity
          style={[styles.githubButton, { backgroundColor: isDark ? '#333' : '#24292e' }]}
          onPress={() => Linking.openURL("https://github.com/raghu-05")}
        >
          <Ionicons name="logo-github" size={22} color="#fff" />
          <Text style={styles.githubButtonText}>View Source on GitHub</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: colors.icon }]}>AgroDoctor v2.0 • Production Build</Text>

      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, // Safe area spacing
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  navBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
    color: "#888",
  },
  listText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  linkButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  techBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  techText: {
    fontSize: 13,
    fontWeight: "600",
  },
  devName: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: "500",
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 15,
    marginTop: 10,
  },
  githubButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.6,
  },
});