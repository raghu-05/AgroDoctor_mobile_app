import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* ✅ ANDROID RIPPLE + IOS FALLBACK */
const MenuButton = ({ onPress, children }: any) => {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple("#c8e6c9", false)}
      >
        <View style={styles.menuItem}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.menuItem}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const logoutUser = async () => {
    await AsyncStorage.removeItem("access_token");
    setMenuVisible(false);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* 🌱 TOP LEFT APP LOGO */}
      <TouchableOpacity
        style={styles.logoIcon}
        onPress={() => setInfoVisible(true)}
      >
        <Text style={styles.logoEmoji}>🌱</Text>
      </TouchableOpacity>

      {/* ☰ TOP RIGHT MENU ICON */}
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => setMenuVisible(true)}
      >
        <MaterialIcons name="more-vert" size={28} color="#1b5e20" />
      </TouchableOpacity>

      {/* 📋 MENU MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <MenuButton
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            >
              <MaterialIcons name="person" size={20} color="#2e7d32" />
              <Text style={styles.menuText}>Profile</Text>
            </MenuButton>

            <MenuButton
              onPress={() => {
                setMenuVisible(false);
                router.push("/about");
              }}
            >
              <MaterialIcons name="info-outline" size={20} color="#2e7d32" />
              <Text style={styles.menuText}>About AgroDoctor</Text>
            </MenuButton>

            <MenuButton
              onPress={() => {
                setMenuVisible(false);
                setInfoVisible(true);
              }}
            >
              <MaterialIcons name="description" size={20} color="#2e7d32" />
              <Text style={styles.menuText}>App Info</Text>
            </MenuButton>

            <View style={styles.menuDivider} />

            <MenuButton onPress={logoutUser}>
              <MaterialIcons name="logout" size={20} color="#d32f2f" />
              <Text style={[styles.menuText, { color: "#d32f2f" }]}>
                Logout
              </Text>
            </MenuButton>
          </View>
        </Pressable>
      </Modal>

      {/* 📄 APP INFO MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={infoVisible}
        onRequestClose={() => setInfoVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setInfoVisible(false)}
        >
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>🌱 AgroDoctor</Text>

            <Text style={styles.infoText}>
              An Integrated App for Plant Health Management using Deep Learning
              and Generative AI.
            </Text>

            <Text style={styles.versionText}>Version 1.0</Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* 🌿 MAIN CONTENT */}
      <View style={styles.content}>
        <Text style={styles.title}>🌱 AgroDoctor</Text>
        <Text style={styles.subtitle}>
          AI-Powered Plant Health Management
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <MaterialIcons name="login" size={20} color="#fff" />
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/upload")}
        >
          <MaterialIcons name="camera-alt" size={20} color="#fff" />
          <Text style={styles.buttonText}>Analyze Plant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/history")}
        >
          <MaterialIcons name="history" size={20} color="#fff" />
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/feedback")}
        >
          <MaterialIcons name="feedback" size={20} color="#fff" />
          <Text style={styles.buttonText}>Give Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/outbreak")}
        >
          <MaterialIcons name="public" size={20} color="#fff" />
          <Text style={styles.buttonText}>Outbreak Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f9f4" },

  content: { flex: 1, justifyContent: "center", padding: 24 },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#4e6e4e",
    textAlign: "center",
    marginBottom: 30,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },

  logoIcon: { position: "absolute", top: 40, left: 20, zIndex: 10 },
  logoEmoji: { fontSize: 28 },

  menuIcon: { position: "absolute", top: 40, right: 20, zIndex: 10 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  menuBox: {
    backgroundColor: "#fff",
    width: 240,
    marginTop: 80,
    marginRight: 16,
    borderRadius: 14,
    elevation: 8,
    paddingVertical: 8,
    overflow: "hidden", // 🔥 REQUIRED FOR RIPPLE
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  menuText: {
    fontSize: 15,
    marginLeft: 12,
    color: "#212121",
    fontWeight: "500",
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 6,
    marginHorizontal: 12,
  },

  infoBox: {
    backgroundColor: "#fff",
    width: "85%",
    alignSelf: "center",
    marginTop: 200,
    borderRadius: 14,
    padding: 20,
    elevation: 8,
  },

  infoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
  },

  infoText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },

  versionText: {
    fontSize: 11,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },

  closeButton: {
    marginTop: 16,
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    borderRadius: 8,
  },

  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
