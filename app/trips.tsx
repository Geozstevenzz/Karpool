import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTripStore } from '@/store/useTripStore';
import { useUserMode } from '../store/userModeStore';

const ConfirmScreen: React.FC = () => {
  const router = useRouter();
  const { mode } = useUserMode(); // Access user mode

  // Three tabs: upcoming, ongoing, and previous
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'previous'>('upcoming');

  // States for fetched trips
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [ongoingTrips, setOngoingTrips] = useState([]);
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
      fetchTrips();
    }
  }, [token]);

  // Fetch all trips and categorize them by status
  const fetchTrips = async () => {
    try {
      // Fetch upcoming trips
      const upcomingResponse = await fetch('http://10.0.2.2:9000/user/upcomingTrips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!upcomingResponse.ok) {
        throw new Error(`Server returned status: ${upcomingResponse.status} for upcoming trips`);
      }

      // Fetch all trips (completed trips)
      const allTripsResponse = await fetch('http://10.0.2.2:9000/user/allUserTrips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!allTripsResponse.ok) {
        throw new Error(`Server returned status: ${allTripsResponse.status} for all trips`);
      }

      // Process responses
      const upcomingData = await upcomingResponse.json();
      const allTripsData = await allTripsResponse.json();

      console.log("Upcoming trips response:", upcomingData);
      console.log("All trips response:", allTripsData);

      // Extract trip arrays
      const upcomingTripsArray = Array.isArray(upcomingData) ? upcomingData : upcomingData.upcomingTrips || [];
      const allTripsArray = Array.isArray(allTripsData) ? allTripsData : allTripsData.allTrips || [];

      // Filter upcoming trips (those with 'upcoming' status)
      const upcomingTripsFiltered = upcomingTripsArray.filter(trip => trip.status === 'upcoming');
      
      // Filter ongoing trips (those with 'ongoing' status)
      const ongoingTripsFiltered = upcomingTripsArray.filter(trip => trip.status === 'ongoing');
      
      // Get completed trips from allTripsArray (all completed trips are in allTripsArray)
      const completedTrips = allTripsArray.filter(trip => trip.status === 'completed');

      console.log("Filtered upcoming trips:", upcomingTripsFiltered.length);
      console.log("Filtered ongoing trips:", ongoingTripsFiltered.length);
      console.log("Completed trips:", completedTrips.length);

      setUpcomingTrips(upcomingTripsFiltered);
      setOngoingTrips(ongoingTripsFiltered);
      setPreviousTrips(completedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Could not fetch trips. Please try again later.');
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
      <Text style={styles.tripDestination}>From: {item.sourcename}</Text>
      <Text style={styles.tripDestination}>To: {item.destinationname}</Text>
      <Text style={styles.tripDetails}>
        {formatDate(item.tripdate)} - {item.triptime}
      </Text>
      <Text style={styles.tripDetails}>Seats: {item.totalseats}</Text>
      <Text style={styles.tripDetails}>Price: ${item.price}</Text>
    </TouchableOpacity>
  );

  // Get the appropriate trip data based on active tab
  const getActiveTabData = () => {
    switch(activeTab) {
      case 'upcoming':
        return upcomingTrips;
      case 'ongoing':
        return ongoingTrips;
      case 'previous':
        return previousTrips;
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>My Trips</Text>
      </View>

      {/* Tab Switcher (Upcoming, Ongoing & Previous) */}
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
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={activeTab === 'ongoing' ? styles.activeTabText : styles.tabText}>
            Ongoing Trips
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
        data={getActiveTabData()}
        keyExtractor={(item) => item.tripid.toString()}
        renderItem={renderTrip}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips found</Text>
          </View>
        }
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  }
});

export default ConfirmScreen;