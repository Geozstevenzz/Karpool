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
  // New state to track whether the trip has started
  const [tripStarted, setTripStarted] = useState(false);

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
        console.log("Selected Trip Requests:", data);
        console.log("Number of Passengers:", selectedTrip.numberofpassengers);
        setTripRequests(data.tripRequests);
      } catch (error) {
        console.error('Error fetching trip requests:', error);
      }
    };

    fetchRequests();
  }, [selectedTrip, token]);

  const handleAccept = async (requestId) => {
    if (!token || !selectedTrip?.tripid) {
      Alert.alert("Error", "Missing authentication token or trip ID.");
      return;
    }
  
    Alert.alert("Accept Request", "Are you sure you want to accept this request?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            console.log("Trip ID:", selectedTrip.tripid);
            console.log("Request ID:", requestId);

            const response = await fetch("http://10.0.2.2:9000/driver/acceptPassengerReq", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Platform": "mobile",
              },
              body: JSON.stringify({ tripId: selectedTrip.tripid, requestId }),
            });
  
            if (!response.ok) {
              throw new Error(`Failed to accept request. Status: ${response.status}`);
            }
  
            // Assume the API returns the updated trip details including the updated numberofpassengers
            const updatedTrip = await response.json();
            useTripStore.setState({ selectedTrip: updatedTrip });
  
            // Also update the specific request's status in local state
            setTripRequests((prevRequests) =>
              prevRequests.map(req =>
                req.requestId === requestId ? { ...req, status: 'ACCEPTED' } : req
              )
            );
          } catch (error) {
            console.error("Error accepting request:", error);
            Alert.alert("Error", "Could not accept request. Please try again.");
          }
        },
      },
    ]);
  };

  const handleReject = async (requestId) => {
    if (!token || !selectedTrip?.tripid) {
      Alert.alert("Error", "Missing authentication token or trip ID.");
      return;
    }
  
    Alert.alert("Reject Request", "Are you sure you want to reject this request?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const response = await fetch("http://10.0.2.2:9000/driver/rejectPassengerReq", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Platform": "mobile",
              },
              body: JSON.stringify({ tripId: selectedTrip.tripid, requestId }),
            });
  
            if (!response.ok) {
              throw new Error(`Failed to reject request. Status: ${response.status}`);
            }
  
            // Update state only if the API call succeeds by removing the rejected request
            setTripRequests((prevRequests) => prevRequests.filter(req => req.requestId !== requestId));
          } catch (error) {
            console.error("Error rejecting request:", error);
            Alert.alert("Error", "Could not reject request. Please try again.");
          }
        },
      },
    ]);
  };

  const handleStartOrStopTrip = () => {
    if (!token || !selectedTrip?.tripid) {
      Alert.alert("Error", "Missing authentication token or trip ID.");
      return;
    }
    
    if (!tripStarted) {
      // Trip not started yet, confirm start
      Alert.alert("Start Trip", "Are you sure you want to start this trip?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              console.log(selectedTrip.tripid);
              
              const response = await fetch(`http://10.0.2.2:9000/driver/trips/${selectedTrip.tripid}/start`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-Platform": "mobile",
                },
              });
              if (!response.ok) {
                throw new Error(`Failed to start trip. Status: ${response.status}`);
              }
              setTripStarted(true);
            } catch (error) {
              console.error("Error starting trip:", error);
              Alert.alert("Error", "Could not start trip. Please try again.");
            }
          },
        },
      ]);
    } else {
      // Trip already started, confirm stop
      Alert.alert("Stop Trip", "Are you sure you want to end this trip?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await fetch(`http://10.0.2.2:9000/driver/trips/${selectedTrip.tripid}/complete`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                  "X-Platform": "mobile",
                },
              });
              if (!response.ok) {
                throw new Error(`Failed to complete trip. Status: ${response.status}`);
              }
              setTripStarted(false);
            } catch (error) {
              console.error("Error stopping trip:", error);
              Alert.alert("Error", "Could not end trip. Please try again.");
            }
          },
        },
      ]);
    }
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
          <Text style={styles.driver}>{selectedTrip.drivername}</Text>
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
          <Text style={styles.timeText}>
            {selectedTrip.tripdate.split('T')[0]} - {selectedTrip.triptime.slice(0, 5)}
          </Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Passenger Requests</Text>
          {tripRequests.filter(request => request.status !== 'REJECTED').length === 0 ? (
            <Text style={styles.noRequestsText}>No passenger requests</Text>
          ) : (
            tripRequests
              .filter(request => request.status !== 'REJECTED')
              .map((request) => (
                <View key={request.requestId} style={styles.requestItem}>
                  <Text style={styles.passengerText}>{request.passenger.username}</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.contactButton} onPress={() => router.push('/contact-driver')}>
                      <Text style={styles.buttonText}>Contact</Text>
                    </TouchableOpacity>
                    {request.status === 'PENDING' && (
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

        {/* Render Start/Stop Trip Button if there are passengers */}
        {selectedTrip.numberofpassengers > 0 && (
          <TouchableOpacity style={styles.startTripButton} onPress={handleStartOrStopTrip}>
            <Text style={styles.buttonText}>{tripStarted ? "Stop Trip" : "Start Trip"}</Text>
          </TouchableOpacity>
        )}
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
  timeText: { fontSize: 14, color: '#666666', marginLeft: 10 },
  errorText: { color: 'red', fontSize: 18 },
  passengerRequestsContainer: { backgroundColor: '#F7F9FC', padding: 15, borderRadius: 8, marginTop: 20 },
  requestItem: { backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  passengerText: { fontSize: 14, color: '#333333', marginBottom: 5 },
  noRequestsText: { fontSize: 14, color: '#666666', fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  contactButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  driver: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
    marginLeft: 10,
    textAlign: 'left',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#dc3545',
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
  startTripButton: {
    backgroundColor: '#FFA500', // Use an appropriate color (e.g., orange)
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default TripDetails;
