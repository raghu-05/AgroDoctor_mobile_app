import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* HEADER */}
        <Text style={styles.title}>🌱 Empowering Farmers with AI</Text>
        <Text style={styles.subtitle}>
          An Integrated App for Plant Health Management Using Deep Learning &
          Generative AI
        </Text>

        {/* VISION */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌿 Our Vision</Text>
          <Text style={styles.cardText}>
            <Text style={styles.bold}>AgroDoctor AI</Text> is not just a disease
            detector; it is a{" "}
            <Text style={styles.italic}>
              comprehensive agricultural decision-support system
            </Text>
            .
            {"\n\n"}
            We answer the most important questions for farmers:
            {"\n"}• How bad is the damage?
            {"\n"}• How much money will I lose?
            {"\n"}• What is the exact treatment plan?
          </Text>
        </View>

        {/* RESEARCH */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            📚 Research Foundation (Base Paper)
          </Text>
          <Text style={styles.cardText}>
            Built upon research published in{" "}
            <Text style={styles.bold}>IEEE Access (2024)</Text>, demonstrating
            high-accuracy plant disease classification using Deep Learning.
          </Text>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() =>
              Linking.openURL(
                "https://ieeexplore.ieee.org/document/10599267"
              )
            }
          >
            <MaterialIcons name="open-in-new" size={18} color="#fff" />
            <Text style={styles.linkButtonText}>
              View Base Paper (IEEE Xplore)
            </Text>
          </TouchableOpacity>

          <Text style={[styles.cardText, styles.italic, { marginTop: 10 }]}>
            Research Gap: Existing work focused on diagnosis accuracy but did not
            address severity, economic loss, or actionable treatment.
          </Text>
        </View>

        {/* INNOVATIONS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🚀 Our Novel Modifications</Text>

          <Text style={styles.listItem}>
            1️⃣ <Text style={styles.bold}>Severity Scoring</Text> – OpenCV-based
            HSV color segmentation to calculate damaged leaf percentage.
          </Text>

          <Text style={styles.listItem}>
            2️⃣ <Text style={styles.bold}>Generative AI Treatment</Text> – Google
            Gemini generates 7-day plans in English, Telugu & Hindi.
          </Text>

          <Text style={styles.listItem}>
            3️⃣ <Text style={styles.bold}>Economic Impact Engine</Text> – Converts
            severity into estimated financial loss (₹).
          </Text>

          <Text style={styles.listItem}>
            4️⃣ <Text style={styles.bold}>Hyper-Local Context</Text> – Location-
            based disease hotspot mapping.
          </Text>
        </View>

        {/* TECHNOLOGIES */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ Technologies Used</Text>

          <View style={styles.techRow}>
            <Text style={styles.techBox}>EfficientNetV2</Text>
            <Text style={styles.techBox}>OpenCV</Text>
            <Text style={styles.techBox}>Google Gemini</Text>
          </View>

          <View style={styles.techRow}>
            <Text style={styles.techBox}>FastAPI</Text>
            <Text style={styles.techBox}>PostgreSQL</Text>
          </View>
        </View>

        {/* DEVELOPERS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍💻 Developed By</Text>

          <Text style={styles.devName}>Arja Raghuveer</Text>
          <Text style={styles.devName}>Kunapareddi Naga Tanuja</Text>
          <Text style={styles.devName}>Lingam Siva Surya Pavan</Text>
          <Text style={styles.devName}>Chinthalagunta Prabhu Kiran</Text>
        </View>


        {/* GITHUB */}
        <View style={styles.card}>
        <Text style={styles.cardTitle}>🔗 Project Repository</Text>

        <TouchableOpacity
            style={styles.githubButton}
            onPress={() => Linking.openURL("https://github.com/raghu-05")}
        >
            <MaterialIcons name="code" size={20} color="#fff" />
            <Text style={styles.githubButtonText}>
            View on GitHub
            </Text>
        </TouchableOpacity>

        <Text style={styles.githubHint}>
            Source code, models, and documentation are available publicly.
        </Text>
        </View>


        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 20,
    paddingBottom: 40,
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },

  cardText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },

  listItem: {
    fontSize: 14,
    marginVertical: 4,
    color: "#333",
  },

  bold: {
    fontWeight: "bold",
  },

  italic: {
    fontStyle: "italic",
  },

  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  techBox: {
    backgroundColor: "#e8f5e9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 13,
    color: "#1b5e20",
    fontWeight: "600",
  },

  devName: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 4,
    color: "#333",
  },

  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  linkButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "bold",
  },

  backButton: {
    flexDirection: "row",
    backgroundColor: "#9e9e9e",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  githubButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#24292e", // GitHub dark
  paddingVertical: 12,
  borderRadius: 10,
  marginTop: 8,
},

githubButtonText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
},

githubHint: {
  marginTop: 8,
  fontSize: 13,
  color: "#555",
  textAlign: "center",
},

});
