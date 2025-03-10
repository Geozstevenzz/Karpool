import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { useTripStore } from '@/store/useTripStore';

const ConfirmScreen: React.FC = () => {
  const router = useRouter();

  // State for tabs (only upcoming & previous trips; if needed, adjust)
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
      console.log("Trips : ", data);
      // If the API returns an array directly, use it; otherwise use data.upcomingTrips
      const tripsArray = Array.isArray(data) ? data : data.upcomingTrips || [];
      setUpcomingTrips(tripsArray);
    } catch (error) {
      console.error('Error fetching upcoming trips:', error);
      Alert.alert('Error', 'Could not fetch upcoming trips.');
    }
  };

  const fetchPreviousTrips = async () => {
    try {
      const response = await fetch('http://10.0.2.2:9000/user/allUserTrips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Server retuned status: ${response.status}`);
      }
  
      const data = await response.json();
      const previousTripsArray = Array.isArray(data) ? data : data.previousTrips || [];
      setPreviousTrips(previousTripsArray);
    } catch (error) {
      console.error('Error fetching previous trips:', error);
      Alert.alert('Error', 'Could not fetch previous trips.');
    }
  };

  // When a trip is pressed, store the trip in useTripStore and navigate
  const handleTripPress = (trip: any) => {
    // Store the selected trip in useTripStore by adding a new property 'selectedTrip'
    useTripStore.setState({ selectedTrip: trip });
    router.push(`/trip-details?tripId=${trip.tripid}`);
  };

  const formatDate = (tripdate: string) => {
    const dateObj = new Date(tripdate);
    return dateObj.toDateString();
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => handleTripPress(item)}>
      <Text style={styles.tripDestination}>Trip ID: {item.tripid}</Text>
      <Text style={styles.tripDetails}>
        {formatDate(item.tripdate)} - {item.triptime}
      </Text>
      <Text style={styles.tripDetails}>Seats: {item.totalseats}</Text>
      <Text style={styles.tripDetails}>Price: ${item.price}</Text>
    </TouchableOpacity>
  );

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
        keyExtractor={(item) => item.tripid.toString()}
        renderItem={renderTrip}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

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
    fontSize: 14,
    color: '#00308F',
  },
  activeTabText: {
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
    fontSize: 16,
    color: '#00308F',
    marginBottom: 5,
  },
  tripDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default ConfirmScreen;
