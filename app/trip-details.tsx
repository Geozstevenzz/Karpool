import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useTripStore } from '@/store/useTripStore';

export default function TripDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Retrieve the selected trip from the trip store (set when a trip is clicked)
  const selectedTrip = useTripStore((state) => state.selectedTrip);
  console.log("Selected Trip:",selectedTrip);

  // State for storing the token
  const [token, setToken] = useState<string | null>(null);

  // Load the token from SecureStore
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token from SecureStore:', error);
      }
    };
    loadToken();
  }, []);

  // Make a request to driver/trips/:tripid/requests once we have a valid trip & token
  useEffect(() => {
    if (!selectedTrip?.tripid || !token) return;
    console.log(selectedTrip.tripid)

    const fetchRequests = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:9000/driver/trips/${selectedTrip.tripid}/requests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-Platform': 'mobile',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const data = await response.json();
        console.log('Trip Requests Response:', data);
      } catch (error) {
        console.error('Erro fetching trip requests:', error);
      }
    };

    fetchRequests();
  }, [selectedTrip, token]);

  if (!selectedTrip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/trips')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
        </View>

        {/* Driver Info Section */}
        <View style={styles.driverInfo}>
          <View style={styles.driverLeftSection}>
            {/* <Image source={selectedTrip.driver.profilePic} style={styles.profilePic} /> */}
            <View style={styles.driverNameSection}>
              <Text style={styles.driverName}>{selectedTrip.drivername}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Trip Information */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Trip Detail</Text>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={20} color="#00308F" />
            <Text style={styles.locationText}>{selectedTrip.sourcename}</Text>
          </View>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={20} color="#FF0000" />
            <Text style={styles.locationText}>{selectedTrip.destinationname}</Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={20} color="#00308F" />
            <Text style={styles.timeText}>
              {selectedTrip.tripdate.split('T')[0]} - {selectedTrip.triptime.slice(0, 5)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBackground: {
    backgroundColor: '#00308F',
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  driverLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  driverNameSection: {
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F7F9FC',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsHeader: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
