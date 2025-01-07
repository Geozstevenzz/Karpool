// screens/trip-details.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface TripDetails {
  id: string;
  destination: string;
  source: string;
  date: string;
  time: string;
  driver: {
    name: string;
    rating: number;
    profilePic: any;
  };
  price: {
    tripExpense: number;
    discountVoucher: number;
    total: number;
  };
}

// Mock data service - replace with actual API calls
const getTripDetails = (id: string): TripDetails => ({
  id,
  destination: 'Mall of Lahore',
  source: 'FAST Lahore',
  date: '2024-12-10',
  time: '10:30 AM',
  driver: {
    name: 'Safwan Akbar',
    rating: 4.5,
    profilePic: require('@/assets/images/react-logo.png'),
  },
  price: {
    tripExpense: 980.0,
    discountVoucher: 200.0,
    total: 780.0,
  },
});

export default function TripDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const tripDetails = getTripDetails(id as string);

  return (
    <View style={styles.mainContainer}>
      {/* Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/menu')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
        </View>

        {/* Driver Info Section */}
        <View style={styles.driverInfo}>
          <View style={styles.driverLeftSection}>
            <Image source={tripDetails.driver.profilePic} style={styles.profilePic} />
            <View style={styles.driverNameSection}>
              <Text style={styles.driverName}>{tripDetails.driver.name}</Text>
              <View style={styles.ratingDisplay}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{tripDetails.driver.rating}</Text>
              </View>
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
            <Text style={styles.locationText}>{tripDetails.source}</Text>
          </View>
          <View style={styles.locationItem}>
            <Ionicons name="location-outline" size={20} color="#FF0000" />
            <Text style={styles.locationText}>{tripDetails.destination}</Text>
          </View>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={20} color="#00308F" />
            <Text style={styles.timeText}>
              {tripDetails.date} - {tripDetails.time}
            </Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeader}>Payment Detail</Text>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Trip Expense</Text>
            <Text style={styles.paymentAmount}>
              PKR {tripDetails.price.tripExpense.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Discount Voucher</Text>
            <Text style={styles.paymentAmount}>
              PKR {tripDetails.price.discountVoucher.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentItem}>
            <Text style={styles.paymentLabel}>Total</Text>
            <Text style={styles.paymentAmount}>
              PKR {tripDetails.price.total.toFixed(2)}
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
    fontFamily: 'Manrope-SemiBold',
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
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
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
    fontFamily: 'Manrope-SemiBold',
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
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#666666',
  },
  paymentAmount: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
});
