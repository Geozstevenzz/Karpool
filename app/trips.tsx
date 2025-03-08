import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function UpcomingOrPreviousTrips() {
  const router = useRouter();

  // State for tabs
  const [activeTab, setActiveTab] = useState<'upcoming' | 'previous'>('upcoming');

  // States for fetched trips
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);

  // State for storing token
  const [token, setToken] = useState<string | null>(null);

  // Load the token from SecureStore once
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    loadToken();
  }, []);

  // Fetch trips once token is available
  useEffect(() => {
    if (token) {
      fetchUpcomingTrips();
      fetchPreviousTrips();
    }
  }, [token]);

  const fetchUpcomingTrips = async () => {
    try {
      const response = await fetch('http://10.0.2.2:9000/user/upcomingTrips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      // Adjust if your API returns a different structure
      // e.g., data might be { upcomingTrips: [...] }
      setUpcomingTrips(data.upcomingTrips || []);
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      Alert.alert('Error', 'Could not fetch upcoming trips.');
    }
  };

  const fetchPreviousTrips = async () => {
    try {
      // Adjust the endpoint if needed (e.g., /user/previousTrips)
      const response = await fetch('http://10.0.2.2:9000/user/previousTrips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      // Adjust if your API returns a different structure
      setPreviousTrips(data.previousTrips || []);
    } catch (error) {
      console.error('Error fetching previous trips:', error);
      Alert.alert('Error', 'Could not fetch previous trips.');
    }
  };

  const handleTripPress = (tripId: string) => {
    // Navigate to trip-details screen
    router.push(`/trip-details`);
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => handleTripPress(item.id)}>
      <Text style={styles.tripDestination}>{item.destination}</Text>
      <Text style={styles.tripDetails}>
        {item.date} - {item.time}
      </Text>
    </TouchableOpacity>
  );

  // Decide which data to render based on active tab
  const tripData = activeTab === 'upcoming' ? upcomingTrips : previousTrips;

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>My Trips</Text>
      </View>

      {/* Tab Switcher (Upcoming & Previous Only) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={activeTab === 'upcoming' ? styles.activeTabText : styles.tabText}>
            Upcoming Trips
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'previous' && styles.activeTab]}
          onPress={() => setActiveTab('previous')}
        >
          <Text style={activeTab === 'previous' ? styles.activeTabText : styles.tabText}>
            Previous Trips
          </Text>
        </TouchableOpacity>
      </View>

      {/* Trip List */}
      <FlatList
        data={tripData}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 24,
    color: '#00308F',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#00308F',
  },
  tabText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#00308F',
  },
  activeTabText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: '#F7F9FC',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  tripDestination: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: '#00308F',
    marginBottom: 5,
  },
  tripDetails: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#666',
  },
});
