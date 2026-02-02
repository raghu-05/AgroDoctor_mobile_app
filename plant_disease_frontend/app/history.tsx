import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from "react-native";
import { useRouter } from "expo-router";
import api from "./services/api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

type HistoryItem = {
  id: number;
  disease_name: string;
  severity: number;
  created_at?: string;
  timestamp?: string;
};

const formatDate = (item: any) => {
  if (!item.timestamp && !item.created_at) return "Date not available";
  const date = new Date(item.timestamp || item.created_at);
  return isNaN(date.getTime())
    ? "Date not available"
    : date.toLocaleDateString() + " • " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function HistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/history/me/");
      // Assuming API returns newest last, reverse to show newest first
      setHistory(response.data.reverse());
    } catch (error) {
      console.log("Failed to fetch history", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.card, 
        borderColor: isDark ? colors.border : 'transparent',
        borderWidth: isDark ? 1 : 0
      }
    ]}>
      
      {/* Icon & Title Row */}
      <View style={styles.cardHeader}>
        <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
          <MaterialCommunityIcons name="leaf" size={24} color={colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.diseaseTitle, { color: colors.text }]}>{item.disease_name}</Text>
          <Text style={[styles.dateText, { color: colors.icon }]}>{formatDate(item)}</Text>
        </View>
      </View>

      {/* Severity Badge */}
      <View style={styles.cardFooter}>
        <View style={styles.severityContainer}>
          <Text style={[styles.severityLabel, { color: colors.icon }]}>Severity:</Text>
          <Text style={[
            styles.severityValue, 
            { color: item.severity > 50 ? colors.danger : colors.primary }
          ]}>
            {item.severity.toFixed(1)}%
          </Text>
        </View>
        
        {/* View Details Arrow */}
        <Ionicons name="chevron-forward" size={20} color={colors.icon} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.screenTitle, { color: colors.text }]}>Diagnosis History</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={60} color={colors.icon} style={{ opacity: 0.5 }} />
              <Text style={[styles.emptyText, { color: colors.icon }]}>No diagnosis history yet.</Text>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backBtn: {
    padding: 5,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  diseaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 12,
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 14,
    marginRight: 6,
  },
  severityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
  },
});