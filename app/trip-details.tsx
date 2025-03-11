import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useTripStore } from '@/store/useTripStore';

export default function TripDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const selectedTrip = useTripStore((state) => state.selectedTrip);
  
  const [token, setToken] = useState<string | null>(null);
  const [tripRequests, setTripRequests] = useState<any[]>([]);

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

  useEffect(() => {
    if (!selectedTrip?.tripid || !token) return;

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
        setTripRequests(data.tripRequests);
      } catch (error) {
        console.error('Error fetching trip requests:', error);
      }
    };

    fetchRequests();
  }, [selectedTrip, token]);

  const handleAccept = async (requestId) => {
    Alert.alert('Accept Request', 'Are you sure you want to accept this request?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: async () => {
          try {
            await fetch('http://10.0.2.2:9000/driver/acceptPassengerReq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ requestId }),
            });
            setTripRequests((prevRequests) =>
              prevRequests.map(req => req.requestId === requestId ? { ...req, accepted: true } : req)
            );
          } catch (error) {
            console.error('Error accepting request:', error);
          }
        }
      }
    ]);
  };

  const handleReject = async (requestId) => {
    Alert.alert('Reject Request', 'Are you sure you want to reject this request?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: async () => {
          try {
            await fetch('http://10.0.2.2:9000/driver/rejectPassengerReq', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ requestId }),
            });
            setTripRequests((prevRequests) => prevRequests.filter(req => req.requestId !== requestId));
          } catch (error) {
            console.error('Error rejecting request:', error);
          }
        }
      }
    ]);
  };

  if (!selectedTrip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/trips')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Passenger Requests</Text>
          {tripRequests.length === 0 ? (
            <Text style={styles.noRequestsText}>No passenger requests</Text>
          ) : (
            tripRequests.map((request) => (
              <View key={request.requestId} style={styles.requestItem}>
                <Text style={styles.passengerText}>{request.passenger.username}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/contact-driver')}>
                    <Text style={styles.buttonText}>Contact</Text>
                  </TouchableOpacity>
                  {!request.accepted && (
                    <>
                      <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(request.requestId)}>
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(request.requestId)}>
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBackground: { backgroundColor: '#00308F', paddingTop: 50, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  detailsContainer: { backgroundColor: '#F7F9FC', padding: 15, borderRadius: 8, marginBottom: 20 },
  detailsHeader: { fontSize: 16, fontWeight: 'bold', color: '#000000', marginBottom: 10 },
  locationItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { fontSize: 14, color: '#666666', marginLeft: 10 },
  timeItem: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  timeText: { fontSize: 14, color: '#666666', marginLeft: 10 },
  errorText: { color: 'red', fontSize: 18 },
  passengerRequestsContainer: { backgroundColor: '#F7F9FC', padding: 15, borderRadius: 8, marginTop: 20 },
  requestItem: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  passengerText: { fontSize: 14, color: '#333333', marginBottom: 5 },
  noRequestsText: { fontSize: 14, color: '#666666', fontStyle: 'italic' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: '#007bff', // Blue for Contact
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  acceptButton: {
    backgroundColor: '#28a745', // Green for Accept
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545', // Red for Reject
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
