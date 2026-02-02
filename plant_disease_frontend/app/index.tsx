import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TouchableWithoutFeedback, 
  RefreshControl,
  StatusBar,
  Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';
import Skeleton from '../components/Skeleton'; 

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  
  // Menus & Modals
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false); // <--- NEW STATE FOR APP INFO
  
  // Data States
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me/');
      setUserName(response.data.name);
    } catch (error) {
      console.log('Failed to load user', error);
      setUserName("Farmer"); 
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const features = [
    { id: 1, title: 'Scan Plant', icon: 'camera', route: '/upload', color: '#4CAF50' }, 
    { id: 2, title: 'History', icon: 'time', route: '/history', color: '#2196F3' },     
    { id: 3, title: 'Outbreak Map', icon: 'map', route: '/outbreak', color: '#FF9800' },
    { id: 4, title: 'Treatment', icon: 'medkit', route: '/treatment', color: '#E91E63' },
    { id: 5, title: 'Feedback', icon: 'chatbubbles', route: '/feedback', color: '#9C27B0' },
    { id: 6, title: 'Profile', icon: 'person', route: '/profile', color: '#607D8B' },   
  ];

  const handleLogout = async () => {
    setMenuVisible(false);
    await AsyncStorage.removeItem('access_token');
    router.replace('/login');
  };

  // OPEN NEW CUSTOM MODAL INSTEAD OF ALERT
  const handleInfo = () => {
    setMenuVisible(false);
    setInfoVisible(true);
  };

  const handleAbout = () => {
    setMenuVisible(false);
    router.push('/about');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>Welcome Back,</Text>
          {loading ? (
            <Skeleton width={150} height={28} style={{ marginTop: 5 }} />
          ) : (
            <Text style={[styles.appName, { color: colors.primary }]}>
              {userName?.split(" ")[0]}!
            </Text>
          )}
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.card, marginRight: 10 }]}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(true)} style={[styles.iconButton, { backgroundColor: colors.card }]}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- 3-DOTS MENU DROPDOWN --- */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.menuContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
                  <Ionicons name="information-circle-outline" size={20} color={colors.text} />
                  <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleInfo}>
                  <Ionicons name="hardware-chip-outline" size={20} color={colors.text} />
                  <Text style={[styles.menuText, { color: colors.text }]}>App Info</Text>
                </TouchableOpacity>
                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={20} color="#FF5252" />
                  <Text style={[styles.menuText, { color: "#FF5252", fontWeight: 'bold' }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- ✨ NEW APP INFO MODAL ✨ --- */}
      <Modal visible={infoVisible} transparent={true} animationType="slide" onRequestClose={() => setInfoVisible(false)}>
        <View style={styles.infoModalOverlay}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            
            {/* ✅ UPDATED LOGO SECTION */}
            <View style={[styles.infoLogoCircle, { backgroundColor: '#fff', elevation: 5 }]}>
               <Image 
                 source={require('../assets/images/icon.jpg')}
                 style={{ width: 60, height: 60, borderRadius: 12 }} 
                 resizeMode="contain"
               />
            </View>
            
            <Text style={[styles.infoTitle, { color: colors.text }]}>AgroDoctor</Text>
            <View style={[styles.versionBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.versionText}>v2.0.0 (Pro)</Text>
            </View>

            {/* ... Rest of the modal stays the same ... */}

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Build</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Production Release</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Engine</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>EfficientNetV2 + Gemini</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.icon }]}>Developer</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>Arja Raghuveer</Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity 
              style={[styles.closeInfoBtn, { backgroundColor: colors.background }]} 
              onPress={() => setInfoVisible(false)}
            >
              <Text style={[styles.closeInfoText, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>

            <Text style={[styles.copyright, { color: colors.icon }]}>© 2026 AgroDoctor AI. All rights reserved.</Text>
          </View>
        </View>
      </Modal>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        
        {/* Hero Banner (With Skeleton) */}
        {loading ? (
          <Skeleton width="100%" height={160} borderRadius={20} style={{ marginBottom: 30 }} />
        ) : (
          <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
            <View>
              <Text style={styles.heroTitle}>Heal Your Crops</Text>
              <Text style={styles.heroSubtitle}>AI-powered instant diagnosis</Text>
              <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/upload')}>
                <Text style={[styles.heroBtnText, { color: colors.primary }]}>Start Scan</Text>
              </TouchableOpacity>
            </View>
            <MaterialCommunityIcons name="leaf" size={80} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
          </View>
        )}

        {/* Features Grid */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.gridContainer}>
          {features.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { backgroundColor: colors.card, borderColor: isDark ? '#333' : '#f0f0f0' }]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <Text style={[styles.cardText, { color: colors.text }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    zIndex: 1, 
  },
  headerIcons: {
    flexDirection: 'row',
  },
  greeting: {
    fontSize: 16,
    opacity: 0.7,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  
  // --- MENU STYLES ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  menuContainer: {
    position: 'absolute',
    top: 110,
    right: 20,
    width: 180,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    marginVertical: 5,
  },

  // --- INFO MODAL STYLES ---
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    width: '85%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  infoLogoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 20,
  },
  versionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoGrid: {
    width: '100%',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeInfoBtn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  closeInfoText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  copyright: {
    marginTop: 20,
    fontSize: 10,
    opacity: 0.6,
  },

  // --- HERO & GRID ---
  heroCard: {
    height: 160,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#E8F5E9',
    marginBottom: 15,
  },
  heroBtn: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    fontWeight: 'bold',
  },
  heroIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  iconBox: {
    padding: 15,
    borderRadius: 50,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
  },
});