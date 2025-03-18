import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useTripStore } from '@/store/useTripStore';
import { useUserMode } from '../store/userModeStore';
import { useUserStore } from '../store/userStore';

export default function ReviewDriver() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const selectedTrip = useTripStore((state) => state.selectedTrip);
  const currentUser = useUserStore((state) => state.user);
  const { mode } = useUserMode();
  const { userId } = useLocalSearchParams();

  console.log("Current Mode: ", mode);
  console.log("Current User: ", currentUser);
  console.log("Selected Trip: ", selectedTrip);
  console.log("TO PASS ", userId);

  const handleRating = (index) => setRating(index + 1);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      Alert.alert('Error', 'Please provide a rating and comment.');
      return;
    }

    if (!selectedTrip || !currentUser) {
      Alert.alert('Error', 'Missing trip or user data.');
      return;
    }

    // Ensure only driver-to-passenger & passenger-to-driver reviews
    let reviewfrom, reviewfor, driverid, passengerid;

    if (mode === 'driver') {
      reviewfrom = 'driver';
      reviewfor = 'passenger';
      driverid = selectedTrip.driverid;
      passengerid = userId; //CHANGE
    } else if (mode === 'passenger') {
      reviewfrom = 'passenger';
      reviewfor = 'driver';
      passengerid = currentUser.userid;
      driverid = selectedTrip.driverid;
    } else {
      Alert.alert('Error', 'Invalid user mode.');
      return;
    }

    if (!driverid || !passengerid) {
      Alert.alert('Error', 'Invalid trip data.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication token missing.');
        return;
      }

      const response = await fetch('http://10.0.2.2:9000/user/submitReview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-platform': 'mobile',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripid: selectedTrip.tripid,
          driverid,
          passengerid,
          reviewfrom,
          reviewfor,
          rating,
          review: comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Review submitted successfully.');
        router.replace('/driver-and-passenger-home'); // Navigate to home or any other screen
      } else {
        Alert.alert('Error', data.message || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Rate Your Trip</Text>
        </View>

        <View style={styles.driverInfo}>
          <View style={styles.driverLeftSection}>
            <Image source={{ uri: selectedTrip?.profile_photo }} style={styles.profilePic} />
            <View style={styles.driverNameSection}>
              <Text style={styles.driverName}>{selectedTrip?.drivername}</Text>
              <View style={styles.ratingDisplay}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{selectedTrip?.driverrating || '4'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.ratingQuestion}>Your rating</Text>

        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRating(index)}>
              <Ionicons name="star" size={35} color={index < rating ? '#FFD700' : '#E0E0E0'} />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Your feedback"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        <View style={styles.submitButtonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBackground: { backgroundColor: '#00308F', paddingTop: 50, paddingBottom: 30, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  headerTitle: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', flex: 1 },
  driverInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  driverLeftSection: { flexDirection: 'row', alignItems: 'center' },
  driverNameSection: { marginLeft: 12 },
  profilePic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFFFFF' },
  driverName: { fontSize: 16, color: '#FFFFFF', marginBottom: 4 },
  ratingDisplay: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, color: '#FFFFFF', marginLeft: 4 },
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  ratingQuestion: { fontSize: 16, color: '#000000', marginBottom: 10 },
  ratingContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 8 },
  commentInput: { width: '100%', height: 100, borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, padding: 10, textAlignVertical: 'top', fontSize: 14, marginBottom: 20 },
  submitButtonContainer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  submitButton: { width: '100%', backgroundColor: '#000000', paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  submitButtonText: { fontSize: 15, color: '#FFFFFF' },
});
