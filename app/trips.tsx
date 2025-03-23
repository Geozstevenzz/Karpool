import React, { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTripStore } from '@/store/useTripStore';
import { useUserMode } from '../store/userModeStore';

const ConfirmScreen: React.FC = () => {
  const router = useRouter();
  const { mode } = useUserMode();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'previous'>('upcoming');
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [ongoingTrips, setOngoingTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);

  const [token, setToken] = useState<string | null>(null);

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

  useEffect(() => {
    if (token) {
      if (mode === 'driver'){
      fetchTrips();
      }

      else if (mode === 'passenger'){
        fetchPassengerTrips();
      }
    }
  }, [token]);


  useFocusEffect(
    useCallback(() => {
      if (token) {
        if (mode === 'driver'){
        fetchTrips();
        }

        else if (mode === 'passenger'){
          fetchPassengerTrips();
        }
      }
    }, [token])
  );


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

      const upcomingData = await upcomingResponse.json();
      const allTripsData = await allTripsResponse.json();

      console.log("Upcoming trips response:", upcomingData);
      console.log("All trips response:", allTripsData);

      const upcomingTripsArray = Array.isArray(upcomingData) ? upcomingData : upcomingData.upcomingTrips || [];
      const allTripsArray = Array.isArray(allTripsData) ? allTripsData : allTripsData.allTrips || [];

      const upcomingTripsFiltered = upcomingTripsArray.filter(trip => trip.status === 'upcoming');
      const ongoingTripsFiltered = upcomingTripsArray.filter(trip => trip.status === 'ongoing');
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



  const fetchPassengerTrips = async () => {
    try {
      const upcomingResponse = await fetch('http://10.0.2.2:9000/passenger/trips/upcoming', {
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

      const ongoingResponse = await fetch('http://10.0.2.2:9000/passenger/trips/ongoing', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!ongoingResponse.ok) {
        throw new Error(`Server returned status: ${ongoingResponse.status} for all trips`);
      }

      const completedResponse = await fetch('http://10.0.2.2:9000/passenger/trips/completed', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
      });

      if (!completedResponse.ok) {
        throw new Error(`Server returned status: ${completedResponse.status} for all trips`);
      }

      const upcomingData = await upcomingResponse.json();
      const ongoingData = await ongoingResponse.json();
      const completedData = await completedResponse.json();

      const upcomingTripsArray = Array.isArray(upcomingData) ? upcomingData : upcomingData.upcomingTrips || [];
      const ongoingTripsArray = Array.isArray(ongoingData) ? ongoingData : ongoingData.ongoingTrips || [];
      const completedTripsArray = Array.isArray(completedData) ? completedData : completedData.completedTrips || [];

      const upcomingTripsFiltered = upcomingTripsArray.filter(trip => trip.status === 'upcoming');
      const ongoingTripsFiltered = ongoingTripsArray.filter(trip => trip.status === 'ongoing');
      const completedTripsFiltered = completedTripsArray.filter(trip => trip.status === 'completed');

      setUpcomingTrips(upcomingTripsFiltered);
      setOngoingTrips(ongoingTripsFiltered);
      setPreviousTrips(completedTripsFiltered);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Could not fetch trips. Please try again later.');
    }
  };



  const handleTripPress = (trip: any) => {
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