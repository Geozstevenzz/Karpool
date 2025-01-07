// screens/trips.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const mockData = {
  currentTrips: [
    { 
      id: '1', 
      destination: 'Mall of Lahore',
      source: 'FAST Lahore', 
      date: '2024-12-10', 
      time: '10:30 AM' 
    },
    // ... rest of the current trips
  ],
  upcomingTrips: [
    { 
      id: '6', 
      destination: 'DHA Phase 6',
      source: 'Johar Town', 
      date: '2024-12-15', 
      time: '9:00 AM' 
    },
    // ... rest of the upcoming trips
  ],
  previousTrips: [
    { 
      id: '11', 
      destination: 'FAST NUCES',
      source: 'Gulberg', 
      date: '2024-12-01', 
      time: '10:00 AM' 
    },
    // ... rest of the previous trips
  ],
};

export default function CurrentOrUpcomingTrips() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'previous'>('current');

  const handleTripPress = (tripId: string) => {
    router.push(`/trip-details`);
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity 
      style={styles.tripCard}
      onPress={() => handleTripPress(item.id)}
    >
      <Text style={styles.tripDestination}>{item.destination}</Text>
      <Text style={styles.tripDetails}>
        {item.date} - {item.time}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Trips</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={activeTab === 'current' ? styles.activeTabText : styles.tabText}>
            Current Trips
          </Text>
        </TouchableOpacity>
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
        data={
          activeTab === 'current'
            ? mockData.currentTrips
            : activeTab === 'upcoming'
            ? mockData.upcomingTrips
            : mockData.previousTrips
        }
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
    alignItems: 'center',
    marginBottom: 20,
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