import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tripData = {
  driver: {
    name: 'Ashfaq Ali',
    profilePic: require('@/assets/images/react-logo.png'),
    rating: 4.9
  },
  trip: {
    pickup: 'FAST NUCES',
    dropoff: 'Home'
  },
  payment: {
    tripExpense: 780.0,
    discountVoucher: 200.0,
    total: 580.0
  }
};

export default function ReviewDriver() {
  const router = useRouter();
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState('');

  const handleRating = (index) => setRating(index + 1);

  const handleSubmit = () => {
    console.log('Submitted review', { rating, comment });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Your Trip</Text>
        </View>

        {/* Driver Info Section */}
        <View style={styles.driverInfo}>
          <View style={styles.driverLeftSection}>
            <Image source={tripData.driver.profilePic} style={styles.profilePic} />
            <View style={styles.driverNameSection}>
              <Text style={styles.driverName}>{tripData.driver.name}</Text>
              <View style={styles.ratingDisplay}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{tripData.driver.rating}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#00308F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Rating Question */}
        <Text style={styles.ratingQuestion}>How is your trip?</Text>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRating(index)}>
              <Ionicons
                name="star"
                size={35}
                color={index < rating ? '#FFD700' : '#E0E0E0'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Input Section */}
        <TextInput
          style={styles.commentInput}
          placeholder="Write your feedback"
          value={comment}
          onChangeText={setComment}
          multiline
        />

        {/* Trip Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Trip Detail</Text>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={20} color="#00308F" />
            <Text style={styles.locationText}>{tripData.trip.pickup}</Text>
          </View>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={20} color="#FF0000" />
            <Text style={styles.locationText}>{tripData.trip.dropoff}</Text>
          </View>
        </View>

        {/* Payment Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Payment Detail</Text>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Trip Expense</Text>
            <Text style={styles.paymentAmount}>PKR {tripData.payment.tripExpense.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Discount Voucher</Text>
            <Text style={styles.paymentAmount}>PKR {tripData.payment.discountVoucher.toFixed(2)}</Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Total</Text>
            <Text style={styles.paymentAmount}>PKR {tripData.payment.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  driverLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverNameSection: {
    marginLeft: 12,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  driverName: {
    
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  chatButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  ratingQuestion: {
    
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  commentInput: {
    width: '100%',
    height: 100,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    
    fontSize: 14,
    marginBottom: 20,
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
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentLabel: {
    
    fontSize: 14,
    color: '#666666',
  },
  paymentAmount: {
    
    fontSize: 14,
    color: '#000000',
  },
  submitButtonContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#000000',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    
    fontSize: 15,
    color: '#FFFFFF',
  },
});
